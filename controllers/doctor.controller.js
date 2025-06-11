import { z } from "zod";

const addDoctorObject = z.object({
  name: z
    .string()
    .min(5, "Name should be bigger than 5 characters")
    .nonempty("Name is a required field."),
  specialization: z.string().nonempty("Specialization is a required field"),
});

export const addDoctor = async (req, res) => {
  const parsedBody = addDoctorObject.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({
      error: parsedBody.error.issues.map((issue) => issue.message),
    });
  }
  const { name, specialization } = parsedBody.data;
};
