// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";

// export const verifyJWT = async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({
//         message: "Unauthorized request",
//       });
//     }

//     // ✅ verify token
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET   // (see Problem #2)
//     );

//     // ✅ FIXED HERE
//     const user = await User.findById(decoded.userId).select(
//       "-refreshToken"
//     );

//     if (!user) {
//       return res.status(401).json({
//         message: "Invalid token",
//       });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(401).json({
//       message: "Invalid or expired token",
//     });
//   }
// };


import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {

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