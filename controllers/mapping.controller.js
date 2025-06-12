import { z } from "zod";
import { DoctorModel, MappingModel, PatientModel } from "../db.js";

const addMappingObject = z.object({
  patientId: z.number().nonnegative(),
  doctorId: z.number().nonnegative(),
});

export const addMapping = async (req, res) => {
  try {
    const parsedBody = addMappingObject.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Validation Failed",
        error: parsedBody.error.issues.map((issue) => issue.message),
      });
    }

    const { patientId, doctorId } = parsedBody.data;

    const patient = await PatientModel.findByPk(patientId);
    const doctor = await DoctorModel.findByPk(doctorId);

    if (!patient || !doctor) {
      return res.status(400).json({
        error: "Please check the patient and doctor ID's",
      });
    }

    const userId = req.user;

    if (patient.UserId.toString() !== userId) {
      return res.status(403).json({
        error:
          "You are not allowed to map this patient, since you have not created it.",
      });
    }

    const mappingExists = await MappingModel.findOne({
      where: {
        patientId: patientId,
        doctorId: doctorId,
      },
    });

    if (mappingExists) {
      return res.status(400).json({
        error: "Mapping for patient and doctor already exists.",
      });
    }

    await MappingModel.create({
      patientId: patientId,
      doctorId: doctorId,
    });

    const mapping = await MappingModel.findOne({
      where: {
        patientId: patientId,
        doctorId: doctorId,
      },
      include: [{ model: PatientModel }, { model: DoctorModel }],
    });

    return res.status(201).json({
      message: "Mapping created for patient and doctor successfully.",
      mapping,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while mapping doctor and patient " + error,
    });
  }
};

export const getAllMapping = async (req, res) => {
  try {
    const mappings = await MappingModel.findAll({
      include: [
        { model: PatientModel, attributes: ["id", "name", "age", "disease"] },
        { model: DoctorModel, attributes: ["id", "name", "specialization"] },
      ],
    });

    return res.status(200).json({
      mappings,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while fetching all the mapping relations. " + error,
    });
  }
};

export const getDoctorMappingByPatientId = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const patientExists = await PatientModel.findByPk(patientId);

    if (!patientExists) {
      return res.status(404).json({
        error: "No such patient found.",
      });
    }

    const mappings = await MappingModel.findAll({
      where: {
        patientId: patientId,
      },
      include: [
        { model: DoctorModel, attributes: ["id", "name", "specialization"] },
      ],
    });

    if (mappings.length === 0) {
      return res.status(400).json({
        error: "No mappings found for the patient",
      });
    }

    return res.status(200).json({
      patientDetails: patientExists,
      mappings,
    });
  } catch (error) {
    return res.json({
      error:
        "Error occured while fetching specific patient's mapping. " + error,
    });
  }
};

const patientIdObject = z.object({
  patientId: z.number().nonnegative(),
});

export const deleteDoctorFromPatient = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const parsedBody = patientIdObject.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Validation Failed",
        error: parsedBody.error.issues[0].message,
      });
    }

    const { patientId } = parsedBody.data;

    const patient = await PatientModel.findByPk(patientId);
    const doctor = await DoctorModel.findByPk(doctorId);

    if (!patient || !doctor) {
      return res.status(400).json({
        error: "Please check the patient's and doctor's ID",
      });
    }

    const mappingExists = await MappingModel.findOne({
      where: {
        patientId: patientId,
        doctorId: doctorId,
      },
    });

    if (!mappingExists) {
      return res.status(400).json({
        error: "No such mapping exists",
      });
    }

    await MappingModel.destroy({
      where: {
        patientId: patientId,
        doctorId: doctorId,
      },
    });

    return res.status(200).json({
      message: "Successfully deleted doctor from patient.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while deleting doctor from patient. " + error,
    });
  }
};
