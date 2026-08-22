import {Router} from 'express';
import { VerificarToken } from '../middlewares/auth.middleware.js';
import { crearCita } from '../controllers/citas.controller.js';

const citasRoutes = Router();

citasRoutes.post('/', VerificarToken, crearCita);

export default citasRoutes;