import { Router } from "express";
import { signin, signout, signup } from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post('/signin', signin)

authRoutes.post('/signup', signup)

authRoutes.post('/signout', signout)

export default authRoutes;