import { UserModel } from "../db.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const registerObject = z.object({
  name: z
    .string()
    .nonempty("Name is a required field")
    .min(5, "Name should be more than atleast 5 characters"),
  email: z
    .string()
    .email("Email should be of the form name@example.com")
    .nonempty("Email is a required field"),
  password: z.string().nonempty("Password is a required field"),
});

export const registerUser = async (req, res) => {
  try {
    const parsedBody = registerObject.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        nessage: "Validation Failed",
        error: parsedBody.error.issues.map((issue) => issue.message),
      });
    }

    const { name, email, password } = parsedBody.data;

    const existingUser = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists, try using a different email",
      });
    }

    const newUser = await UserModel.create({
      email,
      name,
      password,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: "Error occured while registering user " + err,
    });
  }
};

const loginObject = z.object({
  email: z
    .string()
    .email("Email should be of the form name@example.com")
    .nonempty("Email is a required field"),
  password: z.string().nonempty("Password is a required field"),
});

export const loginUser = async (req, res) => {
  try {
    const parsedBody = loginObject.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Validation Failed",
        error: parsedBody.error.issues.map((issue) => issue.message),
      });
    }

    const { email, password } = parsedBody.data;

    const user = await UserModel.findOne({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({
        error:
          "No user with the email found, kindly register using the email first",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: "Invalid Credentials",
      });
    }

    const token = jwt.sign(user.id, `${process.env.JWT_SECRET}`);

    return res.status(201).json({
      message: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while logging in user " + error,
    });
  }
};
