import bcrypt from "bcrypt";
import db from "./src/config/database";

async function seed() {
  try {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const users = [
      { name: "Administrator", email: "admin@kampus.ac.id", role: "admin" },
      { name: "Operator", email: "operator@kampus.ac.id", role: "operator" },
      { name: "Viewer", email: "viewer@kampus.ac.id", role: "viewer" },
    ];
    
    for (const u of users) {
      // Check if user already exists
      const [rows]: any = await db.query("SELECT id FROM users WHERE email = ?", [u.email]);
      if (rows.length === 0) {
        await db.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [u.name, u.email, hashedPassword, u.role]
        );
        console.log(`Berhasil menambahkan user: ${u.email} dengan role ${u.role}`);
      } else {
        console.log(`User ${u.email} sudah ada, melewatinya...`);
      }
    }
    
    console.log("Seeding selesai!");
    process.exit(0);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    process.exit(1);
  }
}

seed();
