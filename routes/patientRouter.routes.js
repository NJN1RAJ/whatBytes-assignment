import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import {
  addPatient,
  deletePatient,
  getPatientById,
  getPatients,
  updatePatient,
} from "../controllers/patient.controller.js";

const router = Router();

router.post("/", verifyUser, addPatient);
router.get("/", verifyUser, getPatients);
router.get("/:id", verifyUser, getPatientById);
router.put("/:id", verifyUser, updatePatient);
router.delete("/:id", verifyUser, deletePatient);

export default router;
