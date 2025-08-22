import { compare, genSalt, hash } from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const salt_round = process.env.SALT_ROUND;

export const hashPassword = async (password) => {
  try {
    if (!password) {
      throw new Error("password is required");
    }
    const salt = await genSalt(salt_round);
    const hashPassword = await hash(password, salt);
    return hashPassword;
  } catch (error) {
    console.error("error from utils hashpassword", error);
  }
};

export const verifyPassword = async (password, hashPassword) => {
  const isValid = await compare(password, hashPassword);
  return isValid;
};
