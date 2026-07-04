import { Router } from "express";
import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller";
import { uploadFotoMahasiswa } from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
 
const router = Router();
 
router.get("/", authMiddleware, getAllMahasiswa);
router.post("/", authMiddleware, uploadFotoMahasiswa.single("foto"), createMahasiswa);
router.put("/:id", authMiddleware, uploadFotoMahasiswa.single("foto"), updateMahasiswa);
router.delete("/:id", authMiddleware, deleteMahasiswa);
 
export default router;
