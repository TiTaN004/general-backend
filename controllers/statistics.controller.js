import { pool } from "../db.js";

export const getStats = async (req, res, next) => {
  try {
    const [row] = await pool.execute("select COUNT(*) as count from form ");

    console.log(row);

    res.status(200).json({
      success: true,
      data: row,
    });
  } catch (error) {
    next(error);
  }
};
