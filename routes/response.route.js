import { Router } from "express";
import { deleteResponses, getResponses, saveResponses, updateResponses } from "../controllers/response.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const responseRoute = Router()

responseRoute.get('/', authenticateToken,getResponses)
responseRoute.put('/:id', authenticateToken, updateResponses)
responseRoute.delete('/:id', authenticateToken, deleteResponses)
responseRoute.post('/', saveResponses)

export default responseRoute