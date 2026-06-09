
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { guestUser } from "../utils/guestData.js";

export const verifyJWT = async (req, res, next) => {
  try {
    if (req.header("X-Guest-Mode") === "true") {
      const guestEmail = req.header("X-Guest-Email") || guestUser.email;

      req.user = {
        ...guestUser,
        email: guestEmail,
      };

      return next();
    }

    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token",
    });

  }
};
