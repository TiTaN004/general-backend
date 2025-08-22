import { pool } from "../db.js";
import { generateToken } from "../utils/token.utils.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import { verifyToken } from "../utils/token.utils.js";

export const signin = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const [rows] = await pool.execute(
      "select id, user_name, password from admin where user_name = ?",
      [userName]
    );

    if (rows.length === 0) {
      await verifyPassword(
        password,
        "$2b$10$dvHIOpWukSXqyukOON3GqeJqIKO4Nog06yF5XYd2BYKI8tlY/7tKW"
      );

      return res.status(401).json({
        success: false,
        message: "invalid credentials",
      });
    }

    const isValid = await verifyPassword(password, rows[0].password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "invalid credentials",
      });
    }
    
    const token = await generateToken({
      id: rows[0].id,
      userName: rows[0].user_name
    })

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000  // 15 hours
    });

    return res.status(200).json({
      success: true,
      user: {
        id: rows[0].id,
        userName: rows[0].user_name
      },
      message: "login successful",
    });
  } catch (error) {
    console.error("error from controller signin ", error);
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        message: "UserName and password are required",
      });
    }

    const passregx =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passregx.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special (@$!%*?&)",
      });
    }

    const [rows] = await pool.execute(
      "select count(id) as count from admin"
    );

    if (rows[0].count > 0) {
      return res.status(403).json({
        success: false,
        message: "signup disabled. Admin already exist",
      });
    } else {
      const hashedPassword = await hashPassword(password);

      const [result] = await pool.execute(
        "insert into admin (user_name,password) values (?,?) ",
        [userName, hashedPassword]
      );

      if (result.affectedRows == 1) {
        return res.status(201).json({
          success: true,
          id: result.insertId,
          message: "Admin created successfully",
        });
      } else {
        throw new Error("Error creating new Admin");
      }
    }
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("error from controller signout ", error);
    next(error);
  }
};

export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  return res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      userName: req.user.userName,
      role: req.user.role
    }
  });
};

export const validateToken = async (req, res) => {
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
    
    res.status(200).json({
      success: true,
      message: "authenticated",
      user: {id: row[0].id,userName: row[0].user_name}
    })
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
}
