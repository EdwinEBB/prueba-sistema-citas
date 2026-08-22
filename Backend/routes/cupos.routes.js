import {Router} from 'express';
import { asignarCupo, consultarCuposPrestador, consultarCuposSolicitante, suscribirPrestador } from '../controllers/cupos.controller.js';
import { VerificarToken } from '../middlewares/auth.middleware.js';

const cuposRoutes = Router();

cuposRoutes.post('/asignar', VerificarToken, asignarCupo);
cuposRoutes.post('/suscribir', VerificarToken, suscribirPrestador);
cuposRoutes.get('/prestador', VerificarToken, consultarCuposPrestador);
cuposRoutes.get('/solicitante', VerificarToken, consultarCuposSolicitante);

export default cuposRoutes;