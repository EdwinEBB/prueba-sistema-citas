import { Router } from 'express';
import { 
  consultarCuposPrestador, 
  consultarCuposSolicitante, 
  obtenerMisReservas,
  asignarCupo, suscribirPrestador, listarPrestadoresDisponibles
} from '../controllers/cupos.controller.js';
import { VerificarToken, esPrestador, esSolicitante } from '../middlewares/auth.middleware.js';

const CuposRoutes = Router();

CuposRoutes.get('/prestador', VerificarToken, esPrestador, consultarCuposPrestador);
CuposRoutes.get('/solicitante', VerificarToken, esSolicitante, consultarCuposSolicitante);
CuposRoutes.get('/mis-reservas', VerificarToken, esSolicitante, obtenerMisReservas);
CuposRoutes.post('/asignar', VerificarToken, esSolicitante, asignarCupo);
CuposRoutes.post('/suscribir', VerificarToken, esSolicitante, suscribirPrestador);
CuposRoutes.get('/prestadores-disponibles', VerificarToken, listarPrestadoresDisponibles);

export default CuposRoutes;