import {Router} from 'express';
import authRoutes from './auth.routes.js';
import citasRoutes from './citas.routes.js';
import cuposRoutes from './cupos.routes.js';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/citas', citasRoutes);
apiRoutes.use('/cupos', cuposRoutes);

export default apiRoutes;