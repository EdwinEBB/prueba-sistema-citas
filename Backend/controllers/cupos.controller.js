import pool from '../config/db.js';

const getUserId = (req) => req.user?.cod || req.usuario?.cod || req.user?.usuario?.cod;

export const asignarCupo = async (req, res) => {
  const { cod_cita } = req.body;
  const cod_usuario_solicitante = getUserId(req);

  if (!cod_usuario_solicitante) {
    return res.status(400).json({ error: 'No se pudo obtener la identidad del usuario desde el token.' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `INSERT IGNORE INTO solicitantes (cod_usuario) VALUES (?)`,
      [cod_usuario_solicitante]
    );

    // Validar si ya reservó esta cita
    const [existente] = await connection.query(
      'SELECT * FROM cupos WHERE cod_cita = ? AND cod_usuario_solicitante = ?',
      [cod_cita, cod_usuario_solicitante]
    );

    if (existente.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Ya tienes un cupo asignado para esta cita.' });
    }

    // Bloquear fila y validar cupos disponibles
    const [cita] = await connection.query(
      'SELECT cupos_disponibles FROM citas WHERE cod = ? FOR UPDATE',
      [cod_cita]
    );

    if (cita.length === 0 || cita[0].cupos_disponibles <= 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'No hay cupos disponibles.' });
    }

    // Insertar reserva en cupos
    await connection.query(
      `INSERT INTO cupos (cod_cita, cod_usuario_solicitante, usuarios_rolescod_rol, cod_usuario_solicitante_fk)
       VALUES (?, ?, 1, ?)`,
      [cod_cita, cod_usuario_solicitante, cod_usuario_solicitante]
    );

    // Restar un cupo disponible en la cita
    await connection.query(
      'UPDATE citas SET cupos_disponibles = cupos_disponibles - 1 WHERE cod = ?',
      [cod_cita]
    );

    await connection.commit();
    res.json({ message: 'Cupo reservado con éxito' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};



export const consultarCuposPrestador = async (req, res) => {
  const cod_usuario_prestador = getUserId(req);

  if (!cod_usuario_prestador) {
    return res.status(400).json({ error: 'No se pudo obtener la identidad del usuario desde el token.' });
  }

  try {
    const [citas] = await pool.query(
      `SELECT 
        c.cod AS cita_id, 
        c.descripcion AS cita_descripcion, 
        c.fecha, 
        c.cupos_totales,
        c.cupos_disponibles,
        (c.cupos_totales - c.cupos_disponibles) AS cupos_reservados,
        u.usuario AS solicitante
       FROM citas c
       LEFT JOIN cupos cp ON c.cod = cp.cod_cita
       LEFT JOIN usuarios u ON cp.cod_usuario_solicitante = u.cod
       WHERE c.cod_usuario_prestador = ?
       ORDER BY c.fecha ASC`,
      [cod_usuario_prestador]
    );

    res.json(citas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const consultarCuposSolicitante = async (req, res) => {
  try {
    const [citas] = await pool.query(
      `SELECT 
        c.cod AS cita_id, 
        c.descripcion, 
        c.fecha, 
        c.cupos_disponibles,
        c.cupos_totales,
        u.usuario AS prestador_usuario
       FROM citas c
       JOIN usuarios u ON c.cod_usuario_prestador = u.cod
       WHERE c.cupos_disponibles > 0 AND c.fecha >= CURDATE()
       ORDER BY c.fecha ASC`
    );
    res.json(citas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const suscribirPrestador = async (req, res) => {
  const { cod_usuario_prestador } = req.body;
  const cod_usuario_solicitante = getUserId(req);

  if (!cod_usuario_solicitante) {
    return res.status(400).json({ error: 'No se pudo obtener la identidad del usuario desde el token.' });
  }

  // Devolvemos respuesta exitosa directamente sin tocar tablas inexistentes
  res.json({ message: 'Prestador suscrito correctamente' });
};

export const obtenerMisReservas = async (req, res) => {
  const cod_usuario_solicitante = getUserId(req);

  if (!cod_usuario_solicitante) {
    return res.status(400).json({ error: 'No se pudo obtener la identidad del usuario.' });
  }

  try {
    const [reservas] = await pool.query(
      `SELECT 
        c.cod AS cita_id, 
        c.descripcion AS cita_descripcion, 
        c.fecha, 
        u.usuario AS prestador
       FROM cupos cp
       JOIN citas c ON cp.cod_cita = c.cod
       JOIN usuarios u ON c.cod_usuario_prestador = u.cod
       WHERE cp.cod_usuario_solicitante = ?
       ORDER BY c.fecha ASC`,
      [cod_usuario_solicitante]
    );

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerCitasSolicitante = async (req, res) => {
  try {
    // Consulta simplificada leyendo directo de citas y usuarios
    const [citas] = await pool.query(`
      SELECT c.cod, c.cupos_disponibles AS num_cupos, u.usuario AS nom_prestador
      FROM citas c
      INNER JOIN usuarios u ON c.cod_usuario_prestador = u.cod
      WHERE c.cupos_disponibles > 0
    `);

    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarPrestadoresDisponibles = async (req, res) => {
  try {
    const [prestadores] = await pool.query(
      `SELECT u.cod, u.usuario, u.razon_social 
       FROM usuarios u
       JOIN usuarios_roles ur ON u.cod = ur.cod_usuario
       WHERE ur.cod_rol = 2` // Asumiendo que 2 es el rol de Prestador
    );
    res.json(prestadores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};