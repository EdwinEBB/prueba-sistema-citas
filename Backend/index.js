import Express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.routes.js';

dotenv.config();

const app = Express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(Express.json());

app.use('/api', apiRoutes);

app.listen(PORT, ()=>{
    console.log(`Servidor iniciado en el puerto ${PORT}`);
})