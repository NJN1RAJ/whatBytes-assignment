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

export const getPatientById = async (req, res) => {
  try {
    const id = req.params.id;
    const patient = await PatientModel.findByPk(id);
    if (!patient) {
      return res.status(400).json({
        error: "No patient found with the id provided",
      });
    }

    return res.status(200).json({
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while retrieving details of patient",
    });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const parsedBody = addPatientObject.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Validation Failed",
        error: parsedBody.error.issues.map((issue) => issue.message),
      });
    }

    const { name, age, disease } = parsedBody.data;

    const patientExists = await PatientModel.findByPk(id);

    if (!patientExists) {
      return res.status(400).json({
        error: "No patient exist with such id",
      });
    }
    const userId = req.user;

    if (patientExists.UserId.toString() !== userId) {
      return res.status(403).json({
        error: "You are not allowed to edit this patient",
      });
    }

    await PatientModel.update(
      { name, age, disease },
      {
        where: {
          id: id,
        },
      }
    );

    return res.status(200).json({
      message: "Patient details updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while updating patient details. " + error,
    });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const patientExists = await PatientModel.findByPk(id);

    if (!patientExists) {
      return res.status(404).json({
        error: "No such patient found",
      });
    }

    const userId = req.user;

    if (patientExists.UserId.toString() !== userId) {
      return res.status(403).json({
        error: "You are not allowed to delete this patient",
      });
    }

    await PatientModel.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while deleting patient's record.",
    });
  }
};
