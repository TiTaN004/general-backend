import { Router } from "express";
import { signin, signout, signup, validateToken } from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post('/signin', signin)

authRoutes.post('/signup', signup)

authRoutes.post('/signout', signout)

authRoutes.post('/verify', validateToken)

export default authRoutes;