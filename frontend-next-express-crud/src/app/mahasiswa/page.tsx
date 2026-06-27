"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  getProdi,
  Mahasiswa,
  Prodi,
  updateMahasiswa,
} from "@/lib/api";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  // Pagination & Filter States
  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const loadProdi = async () => {
    try {
      const data = await getProdi();
      setProdiList(data);
    } catch (err) {
      console.error("Gagal load prodi", err);
    }
  };

  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit,
      });
      setMahasiswa(result.data);
      setTotalPage(result.meta.totalPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProdi();
  }, []);

  useEffect(() => {
    loadMahasiswa();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    loadMahasiswa();
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setMessage("");
      setError("");

      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, formData);
        setMessage("Data mahasiswa berhasil diperbarui");
      } else {
        await createMahasiswa(formData);
        setMessage("Data mahasiswa berhasil ditambahkan");
      }

      setSelectedMahasiswa(null);
      setPage(1);
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteMahasiswa(id);
      setMessage("Data mahasiswa berhasil dihapus");
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Mahasiswa</h1>
          <p>Frontend Next.js yang terhubung ke backend Express.js.</p>
        </div>

        <Link href="/">
          <button className="btn-secondary">Kembali</button>
        </Link>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <MahasiswaForm
        selectedMahasiswa={selectedMahasiswa}
        prodiList={prodiList}
        onSubmit={handleSubmit}
        onCancelEdit={() => setSelectedMahasiswa(null)}
      />

      <section className="card" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
          <h2>Daftar Mahasiswa</h2>
          
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari NIM atau nama"
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            
            <select 
              value={prodiId} 
              onChange={(e) => setProdiId(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="">Semua Prodi</option>
              {prodiList.map((item) => (
                <option key={item.id} value={item.id}>{item.nama_prodi}</option>
              ))}
            </select>
            
            <button className="btn-primary" onClick={handleSearch}>Cari</button>
          </div>
        </div>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <>
            <MahasiswaTable
              mahasiswa={mahasiswa}
              onEdit={setSelectedMahasiswa}
              onDelete={handleDelete}
            />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
              <span>Halaman {page} dari {totalPage || 1}</span>
              <div style={{ display: "flex", gap: 10 }}>
                <button 
                  className="btn-secondary" 
                  disabled={page <= 1} 
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <button 
                  className="btn-secondary" 
                  disabled={page >= totalPage} 
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
