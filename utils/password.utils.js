import { compare, genSalt, hash } from "bcrypt"
import dotenv from "dotenv"

dotenv.config()

const salt_round = process.env.SALT_ROUND

export const hashPassword = async (password) => {
    try {
        const salt = genSalt(salt_round)
        const hashPassword = hash(password,salt)
        return hashPassword
        
    } catch (error) {
        console.log("error from utils hashpassword", error)
    }
}

export const verifyPassword = async (password, hashPassword) => {
    const isValid = compare(password,salt)
    return isValid
}