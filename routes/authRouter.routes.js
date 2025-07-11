import { Router } from "express";
import { UserModel } from "../db.js";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
