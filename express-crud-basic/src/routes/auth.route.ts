import { Router } from "express";
import { register, login, forgotPassword, resetPasswordWithToken } from "../controllers/auth.controller";
 
const router = Router();
 
router.post("/register", register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.json({ message: "Logout berhasil. Hapus token di frontend." });
});
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordWithToken);
 
export default router;
