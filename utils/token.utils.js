import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const generateToken = (payload) => {
    try {
        const token = jwt.sign(payload,process.env.SECRET, {
            expiresIn: '30m',
            issuer: 'www.ynbnexus.com',
            audience: 'admin-user'
        })
        return token
    } catch (error) {
        throw new Error("error generating token ",error)
    }
}

export const verifyToken = (token) => {
    return jwt.verify(token,process.env.SECRET)
}

