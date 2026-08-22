import jwt from 'jsonwebtoken';

export const VerificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const verificado= jwt.verify(token, process.env.JWT_SECRET || 'scrsc2108');
        req.user = verificado;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token inválido' });
    }
}