import { pool } from "../db.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";

export const signin = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const [rows] = await pool.execute(
      "select user_name, password from admin where user_name = ?",
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

    return res.status(200).json({
      success: true,
      message: "login successful",
    });
  } catch (error) {
    console.log("error from controller signin ", error);
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    console.log(userName, password);

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
      "select * from admin where user_name = ?",
      [userName]
    );

    if (rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "UserName already exist",
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
  res.send("signout route");
};
