import {Router} from 'express';
import { VerificarToken, esPrestador } from '../middlewares/auth.middleware.js';
import { crearCita } from '../controllers/citas.controller.js';

const citasRoutes = Router();

citasRoutes.post('/', VerificarToken, esPrestador, crearCita);

export default citasRoutes;