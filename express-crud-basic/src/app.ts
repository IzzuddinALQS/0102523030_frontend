import express, { Request, Response } from "express";
import cors from "cors";
import mahasiswaRoutes from "./routes/mahasiswa.route";
import mahasiswaDbRoutes from "./routes/mahasiswa-db.route";
import path from "path";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// Middleware logging sederhana
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Endpoint dasar (Pertemuan 1)
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API Express CRUD berjalan" });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "Express CRUD API",
  });
});

app.get("/profile", (req: Request, res: Response) => {
  res.json({
    nama: "Mahasiswa",
    kampus: "Universitas Contoh",
    prodi: "Informatika",
  });
});

app.get("/about", (req: Request, res: Response) => {
  res.json({
    aplikasi: "Express CRUD Basic",
    versi: "1.0.0",
    deskripsi: "Modul pembelajaran Express.js untuk CRUD API",
  });
});

// Route CRUD array (Pertemuan 2)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/mahasiswa", mahasiswaRoutes);

// Route CRUD database (Pertemuan 3)
app.use("/api/db/mahasiswa", mahasiswaDbRoutes);

export default app;
