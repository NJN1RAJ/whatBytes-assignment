import { z } from "zod";
import { DoctorModel } from "../db.js";

const addDoctorObject = z.object({
  name: z
    .string()
    .min(5, "Name should be bigger than 5 characters")
    .nonempty("Name is a required field."),
  specialization: z.string().nonempty("Specialization is a required field"),
});

export const addDoctor = async (req, res) => {
  try {
    const parsedBody = addDoctorObject.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: parsedBody.error.issues.map((issue) => issue.message),
      });
    }
    const { name, specialization } = parsedBody.data;

    const newDoctor = await DoctorModel.create({
      name,
      specialization,
    });

    return res.status(201).json({
      message: "Doctor added successfully",
      doctor: {
        name: newDoctor.name,
        specialization: newDoctor.specialization,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while adding doctor",
    });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await DoctorModel.findAll();
    res.status(200).json({
      doctors,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while fetching doctor details.",
    });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const id = req.params.id;
    const doctor = await DoctorModel.findByPk(id);
    if (!doctor) {
      return res.status(400).json({
        error: "No doctor found with provided ID.",
      });
    }

    return res.status(200).json({
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while fetching doctor details",
    });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const id = req.params.id;

    const doctorExists = await DoctorModel.findByPk(id);

    if (!doctorExists) {
      return res.status(400).json({
        error: "No such doctor exist with provided id.",
      });
    }

    const parsedBody = addDoctorObject.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: parsedBody.error.issues.map((issue) => issue.message),
      });
    }

    const { name, specialization } = parsedBody.data;

    await DoctorModel.update(
      { name, specialization },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(200).json({
      message: "Details of doctor updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while updating doctor.",
    });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const id = req.params.id;

    const doctorExists = await DoctorModel.findByPk(id);

    if (!doctorExists) {
      return res.status(200).json({
        error: "No doctor found with following id.",
      });
    }

    await DoctorModel.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Doctor's record deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while deleting doctor.",
    });
  }
};
