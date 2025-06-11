import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import { addPatient, getPatients } from "../controllers/patient.contoller.js";

const router = Router();

router.post("/", verifyUser, addPatient);

router.get("/", verifyUser, getPatients);

export default router;
