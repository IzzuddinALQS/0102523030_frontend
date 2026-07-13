"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordWithToken } from "@/lib/api";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Read the token from the URL query params
    const searchParams = new URLSearchParams(window.location.search);
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Token tidak ditemukan di URL");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Token tidak valid");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const result = await resetPasswordWithToken(token, newPassword);
      setMessage(result.message);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="header">
        <h1>Buat Password Baru</h1>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <section className="card">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <label>Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading || !token}>
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </form>
      </section>
    </main>
  );
}
