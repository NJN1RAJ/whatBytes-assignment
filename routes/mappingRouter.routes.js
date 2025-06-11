import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import {
  addMapping,
  deleteDoctorFromPatient,
  getAllMapping,
  getDoctorMappingByPatientId,
} from "../controllers/mapping.controller.js";

const router = Router();

router.post("/", verifyUser, addMapping);
router.get("/", verifyUser, getAllMapping);
router.get("/:patientId", verifyUser, getDoctorMappingByPatientId);
router.delete("/:id", verifyUser, deleteDoctorFromPatient);

export default router;
