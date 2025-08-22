import { success } from "zod";
import { pool } from "../db.js";
import { responseModel } from "../model/response.model.js";

export const saveResponses = async (req, res, next) => {
  try {
    const parsed = responseModel.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues.map((e) => e.message).join(", "),
      });
    }

    const [rows] = await pool.execute(
      "insert into form (name,email,mobile,message) values(?,?,?,?)",
      [
        parsed.data.name,
        parsed.data.email,
        parsed.data.mobile,
        parsed.data.message,
      ]
    );

    if (rows.affectedRows == 1) {
      return res.status(201).json({
        success: true,
        message: "Response saved successfully",
      });
    } else {
      throw new Error("Error saving response");
    }
  } catch (error) {
    next(error);
  }
};

export const getResponses = async (req, res, next) => {
  try {
    const { limit, page } = req.body;

    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(
      "select * from form LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [[{ total }]] = await pool.execute(
      "select COUNT(*) as total from form"
    );
    return res.status(200).json({
      success: true,
      data: rows,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResponses = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute("delete from form where id = ? ", [id]);

    if (rows.affectedRows == 1) {
      return res.status(200).json({
        success: true,
        message: "response deleted successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateResponses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parsed = responseModel.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues.map((e) => e.message).join(", "),
      });
    }

    const [rows] = await pool.execute(
      "update form set name = ?, email = ?, mobile = ?, message = ? where id = ?",
      [
        parsed.data.name,
        parsed.data.email,
        parsed.data.mobile,
        parsed.data.message,
        id,
      ]
    );

    if (rows.affectedRows == 1) {
      return res.status(201).json({
        success: true,
        message: "Response updated successfully",
      });
    } else {
      throw new Error("Error updating response");
    }
  } catch (error) {
    next(error);
  }
};
