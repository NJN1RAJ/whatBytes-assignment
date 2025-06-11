import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import {
  addDoctor,
  getDoctorById,
  getDoctors,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";

const router = Router();

router.post("/", verifyUser, addDoctor);
router.get("/", verifyUser, getDoctors);
router.get("/:id", verifyUser, getDoctorById);
router.put("/:id", verifyUser, updateDoctor);
router.delete("/:id", verifyUser, deleteDoctor);

export default router;
