import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./db.js";
import authRouter from "./routes/authRouter.routes.js";
import patientRouter from "./routes/patientRouter.routes.js";
import doctorRouter from "./routes/doctorRouter.routes.js";

const app = express();
app.use(express.json());
dotenv.config();

try {
  connectToDB();
} catch (error) {
  console.log("Error while connecting to DB " + error);
}

app.use("/api/auth", authRouter);
app.use("/api/patients", patientRouter);
app.use("/api/doctors", doctorRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
