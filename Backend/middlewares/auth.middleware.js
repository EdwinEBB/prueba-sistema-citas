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



//Verificar que es prestador
export const esPrestador = (req, res, next) => {
  const rol = String(req.user?.rol || req.user?.cod_rol || '').toLowerCase();

  // Acepta "prestador", "2" o el valor numérico 2
  if (rol !== 'Prestador' && rol !== '2') { 
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Prestador.' });
  }

  next();
};

// Verificar que es solicitante
export const esSolicitante = (req, res, next) => {
  const rol = String(req.user?.rol || req.user?.cod_rol || '').toLowerCase();

  // Acepta "solicitante", "1" o el valor numérico 1
  if (rol !== 'Solicitante' && rol !== '1') { 
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Solicitante.' });
  }

  next();
};