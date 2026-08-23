import { Router } from 'express';
import { 
  consultarCuposPrestador, 
  consultarCuposSolicitante, 
  obtenerMisReservas,
  asignarCupo, suscribirPrestador, listarPrestadoresDisponibles
} from '../controllers/cupos.controller.js';
import { VerificarToken } from '../middlewares/auth.middleware.js';

const CuposRoutes = Router();

CuposRoutes.get('/prestador', VerificarToken, consultarCuposPrestador);
CuposRoutes.get('/solicitante', VerificarToken, consultarCuposSolicitante);
CuposRoutes.get('/mis-reservas', VerificarToken ,obtenerMisReservas); // <- Asegúrate de incluir esta ruta
CuposRoutes.post('/asignar', VerificarToken, asignarCupo);
CuposRoutes.post('/suscribir', VerificarToken,suscribirPrestador);
CuposRoutes.get('/prestadores-disponibles', VerificarToken, listarPrestadoresDisponibles);

export default CuposRoutes;