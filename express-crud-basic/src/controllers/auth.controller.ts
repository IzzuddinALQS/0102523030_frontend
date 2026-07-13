import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/database";
 
export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;
 
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi",
      });
    }
 
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter",
      });
    }
 
    const [existing]: any = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
 
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "viewer"]
    );
 
    return res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
 
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }
 
    const [rows]: any = await db.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );
 
    if (rows.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }
 
    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
 
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email atau password salah" });
    }
 
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
    );
 
    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

import crypto from "crypto";
import { mailer } from "../config/mail";

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    const [users]: any = await db.query("SELECT id, email, name FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    const user = users[0];

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    
    // Expires in 30 minutes
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await db.query(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [user.id, tokenHash, expiresAt]
    );

    const resetLink = `${process.env.APP_URL}/reset-password?token=${rawToken}`;
    
    await mailer.sendMail({
      from: `Admin Kampus <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Reset Password",
      html: `
        <p>Halo ${user.name},</p>
        <p>Anda meminta reset password.</p>
        <p>Klik link berikut untuk mengganti password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>Link berlaku selama 30 menit.</p>
      `,
    });

    return res.json({ message: "Link reset password telah dikirim ke email Anda" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const resetPasswordWithToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token dan password baru wajib diisi" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const [tokens]: any = await db.query(
      "SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()",
      [tokenHash]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa" });
    }
    
    const resetToken = tokens[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, resetToken.user_id]);
    await db.query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?", [resetToken.id]);

    return res.json({ message: "Password berhasil diubah. Silakan login dengan password baru." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
