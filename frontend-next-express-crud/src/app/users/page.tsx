"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, getUsers, createUser, updateUser, deleteUser, resetPassword } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({ id: 0, name: "", email: "", role: "viewer", password: "" });
  const [isEditing, setIsEditing] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser?.role !== "admin") {
      window.location.href = "/mahasiswa";
    } else {
      loadUsers();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      if (isEditing) {
        await updateUser(formData.id, { name: formData.name, email: formData.email, role: formData.role as any });
        setMessage("User berhasil diperbarui");
      } else {
        await createUser({ name: formData.name, email: formData.email, role: formData.role as any, password: formData.password } as any);
        setMessage("User berhasil ditambahkan");
      }
      setFormData({ id: 0, name: "", email: "", role: "viewer", password: "" });
      setIsEditing(false);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan pengguna");
    }
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setFormData({ id: user.id, name: user.name, email: user.email, role: user.role, password: "" });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      setError("");
      setMessage("");
      await deleteUser(id);
      setMessage("User berhasil dihapus");
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus pengguna");
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!window.confirm("Yakin ingin mereset password user ini?")) return;
    try {
      setError("");
      setMessage("");
      const result = await resetPassword(id);
      alert(`Password sementara: ${result.temporaryPassword}\n\nNote: ${result.note}`);
      setMessage("Password berhasil direset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mereset password");
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>Manajemen User</h1>
          <p>Halaman khusus admin.</p>
        </div>
        <div>
          <Link href="/mahasiswa">
            <button className="btn-secondary">Kembali</button>
          </Link>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <section className="card">
        <h2>{isEditing ? "Edit User" : "Tambah User"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" }}>
          <input
            name="name"
            placeholder="Nama"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="input"
          />
          {!isEditing && (
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required={!isEditing}
              className="input"
            />
          )}
          <select name="role" value={formData.role} onChange={handleInputChange} className="input">
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="viewer">Viewer</option>
          </select>
          <button type="submit" className="btn-primary">
            {isEditing ? "Update" : "Simpan"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setFormData({ id: 0, name: "", email: "", role: "viewer", password: "" });
              }}
            >
              Batal
            </button>
          )}
        </form>
      </section>

      <section className="card" style={{ marginTop: "20px" }}>
        <h2>Daftar User</h2>
        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <table style={{ marginTop: "15px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Dibuat Pada</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button className="btn-secondary" onClick={() => handleEdit(user)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(user.id)}>Hapus</button>
                      <button className="btn-secondary" onClick={() => handleResetPassword(user.id)}>Reset Password</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
