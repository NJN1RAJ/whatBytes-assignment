import { z } from "zod";
import { PatientModel } from "../db.js";

const addPatientObject = z.object({
  name: z
    .string()
    .min(5, "Name should be more than 5 characters")
    .nonempty("Name is a reqired field."),
  age: z.number().nonnegative("Age cannot be negative"),
  disease: z.string().nonempty("Disease is a required field."),
});

export const addPatient = async (req, res) => {
  try {
    const parsedBody = addPatientObject.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: parsedBody.error.issues.map((issue) => issue.message),
      });
    }

    const userId = req.user;

    const { name, age, disease } = parsedBody.data;

    const newPatient = await PatientModel.create({
      name,
      age,
      disease,
      UserId: userId,
    });

    return res.status(201).json({
      message: "Patient created successfully",
      patient: {
        name: newPatient.name,
        age: newPatient.age,
        disease: newPatient.disease,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while adding patient",
    });
  }
};

export const getPatients = async (req, res) => {
  try {
    const userId = req.user;
    const patients = await PatientModel.findAll({
      where: {
        UserId: userId,
      },
    });
    if (patients.length === 0) {
      return res.status(400).json({
        error: "No patients added by the logged in user.",
      });
    }

    return res.status(200).json({
      patients,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while fetching patients " + error,
    });
  }
};
