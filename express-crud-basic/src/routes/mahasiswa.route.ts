import { Router, Request, Response } from "express";
import { mahasiswa, Mahasiswa } from "../data/mahasiswa.data";

const router = Router();

// READ ALL
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Data mahasiswa berhasil diambil",
    data: mahasiswa,
  });
});

// SEARCH BY KEYWORD
router.get("/search/:keyword", (req: Request, res: Response) => {
  const keyword = req.params.keyword.toLowerCase();
  const hasil = mahasiswa.filter((item) =>
    item.nama.toLowerCase().includes(keyword)
  );

  res.json({
    message: `Hasil pencarian untuk '${req.params.keyword}'`,
    data: hasil,
  });
});

// READ DETAIL
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = mahasiswa.find((item) => item.id === id);

  if (!data) {
    res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    return;
  }

  res.json({
    message: "Detail mahasiswa berhasil diambil",
    data,
  });
});

// CREATE
router.post("/", (req: Request, res: Response) => {
  const { nim, nama, prodi, angkatan } = req.body;

  if (!nim || !nama || !prodi || !angkatan) {
    res.status(400).json({
      message: "NIM, nama, prodi, dan angkatan wajib diisi",
    });
    return;
  }

  // Validasi nama minimal 3 karakter
  if (nama.length < 3) {
    res.status(400).json({
      message: "Nama harus minimal 3 karakter",
    });
    return;
  }

  // Cek duplikat NIM
  const nimExists = mahasiswa.find((item) => item.nim === nim);
  if (nimExists) {
    res.status(400).json({
      message: "NIM sudah digunakan",
    });
    return;
  }

  const newMahasiswa: Mahasiswa = {
    id: mahasiswa.length + 1,
    nim,
    nama,
    prodi,
    angkatan: Number(angkatan),
  };

  mahasiswa.push(newMahasiswa);

  res.status(201).json({
    message: "Mahasiswa berhasil ditambahkan",
    data: newMahasiswa,
  });
});

// UPDATE
router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nim, nama, prodi, angkatan } = req.body;

  const index = mahasiswa.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    return;
  }

  mahasiswa[index] = {
    id,
    nim,
    nama,
    prodi,
    angkatan: Number(angkatan),
  };

  res.json({
    message: "Mahasiswa berhasil diperbarui",
    data: mahasiswa[index],
  });
});

// DELETE
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = mahasiswa.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    return;
  }

  const deletedData = mahasiswa.splice(index, 1);

  res.json({
    message: "Mahasiswa berhasil dihapus",
    data: deletedData[0],
  });
});

export default router;
