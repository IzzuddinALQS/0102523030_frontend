"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { Mahasiswa, Prodi } from "@/lib/api";

type Props = {
  selectedMahasiswa: Mahasiswa | null;
  prodiList: Prodi[];
  onSubmit: (formData: FormData) => Promise<void>;
  onCancelEdit: () => void;
};

export default function MahasiswaForm({
  selectedMahasiswa,
  prodiList,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [angkatan, setAngkatan] = useState(new Date().getFullYear());
  const [foto, setFoto] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMahasiswa) {
      setNim(selectedMahasiswa.nim);
      setNama(selectedMahasiswa.nama);
      setProdiId(String(selectedMahasiswa.prodi_id));
      setAngkatan(selectedMahasiswa.angkatan);
      setFoto(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setNim("");
      setNama("");
      setProdiId("");
      setAngkatan(new Date().getFullYear());
      setFoto(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [selectedMahasiswa]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("nim", nim);
      formData.append("nama", nama);
      formData.append("prodi_id", prodiId);
      formData.append("angkatan", String(angkatan));
      if (foto) {
        formData.append("foto", foto);
      }

      await onSubmit(formData);
      
      if (!selectedMahasiswa) {
        setNim("");
        setNama("");
        setProdiId("");
        setAngkatan(new Date().getFullYear());
        setFoto(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>{selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</h2>

      <div className="grid">
        <div className="form-group">
          <label htmlFor="nim">NIM</label>
          <input
            id="nim"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            placeholder="Contoh: 2201001"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nama">Nama</label>
          <input
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama mahasiswa"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="prodi">Prodi</label>
          <select
            id="prodi"
            value={prodiId}
            onChange={(e) => setProdiId(e.target.value)}
            required
          >
            <option value="">Pilih Prodi</option>
            {prodiList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama_prodi}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="angkatan">Angkatan</label>
          <input
            id="angkatan"
            type="number"
            value={angkatan}
            onChange={(e) => setAngkatan(Number(e.target.value))}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="foto">Foto (Opsional)</label>
          <input
            id="foto"
            type="file"
            accept="image/jpeg, image/png, image/webp"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFoto(e.target.files[0]);
              } else {
                setFoto(null);
              }
            }}
          />
        </div>
      </div>

      <div className="actions" style={{ marginTop: 15 }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Menyimpan..." : selectedMahasiswa ? "Update" : "Simpan"}
        </button>

        {selectedMahasiswa && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Batal Edit
          </button>
        )}
      </div>
    </form>
  );
}
