import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getStats } from "../controllers/statistics.controller.js";

export const statisticRoute = Router()

statisticRoute.get('/',authenticateToken,getStats)