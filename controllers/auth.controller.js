import { hashPassword } from "../utils/password.utils.js"

export const signin = async (req, res, next) => {
    try {
        const newPassword = await hashPassword(res.password)
        res.send({hashedPassword: newPassword})
    } catch (error) {
        // throw error("something wrong with singin logic")
        console.log("error from controller signin ", error)
    }
}

export const signup = (req, res, next) => {
    res.send('signup route')
}

export const signout = (req, res, next) => {
    res.send('signout route')
}
