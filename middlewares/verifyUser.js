import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(400).json({
        error: "No authorization header found.",
      });
    }

    const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`);
    if (!decodedToken) {
      return res.status(500).json({
        error: "Token not valid",
      });
    }

    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(500).json({
      error: "Error occured while verifying user",
    });
  }
};
