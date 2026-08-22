import {Router} from 'express';
import { registrarUsuario, login, asignarPerfil } from '../controllers/auth.controller.js';

const authRoutes = Router();

authRoutes.post('/register', registrarUsuario);
authRoutes.post('/login', login);
authRoutes.post('/asignar-perfil', asignarPerfil);

export default authRoutes;