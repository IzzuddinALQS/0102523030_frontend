"use client";
 
import { useState } from "react";
import { saveAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api";
 
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
 
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setError(result.message || "Login gagal");
        return;
      }
  
      saveAuth(result.token, result.user);
      window.location.href = "/mahasiswa";
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi server");
    }
  };
 
  return (
    <main className="container" style={{ maxWidth: 400, marginTop: 100 }}>
      <form onSubmit={handleLogin} className="card">
        <h1 style={{ textAlign: "center", marginBottom: 20 }}>Login</h1>
        {error && <p className="message error">{error}</p>}
        
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Contoh: admin@kampus.ac.id" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
        </div>
        
        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 10 }}>
          Login
        </button>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <Link href="/forgot-password" style={{ color: "#0070f3", textDecoration: "none" }}>
            Lupa Password?
          </Link>
        </div>
      </form>
    </main>
  );
}
