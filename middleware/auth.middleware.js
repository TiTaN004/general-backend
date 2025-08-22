// import jwt from "jsonwebtoken";
// import { verifyToken } from "../utils/token.utils";

// export const authenticateToken = (req, res, next) => {
//   try {
//     const token =
//       req.cookies.authToken || req.header.authorization?.split(" ")[1];

//     if (!token) {
//       req.status(401).json({
//         success: false,
//         message: "Access token required",
//       });
//     }

//     const decoded = verifyToken(token);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ success: false, message: "Token expired" });
//     }
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({ success: false, message: "Invalid token" });
//     }
//     next(error);
//   }
// };

import { pool } from "../db.js";
import { verifyToken } from "../utils/token.utils.js";

export const authenticateToken = async (req, res, next) => {
  try {
    // Get token either from cookies or from Authorization header
    const token =
      req.cookies?.authToken || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // check in db

    const [row] = await pool.execute("select id, user_name from admin where id = ? and user_name = ? ", [decoded.id, decoded.userName])

    if(row.length == 0){
      res.status(401).json({
        success: false,
        message: "user not found"
      })
    }

    // Attach decoded user info to request
    req.user = decoded;

    // Continue to next middleware/route
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Unhandled error
    return res.status(500).json({
      success: false,
      message: "Something went wrong while authenticating",
    });
  }
};
