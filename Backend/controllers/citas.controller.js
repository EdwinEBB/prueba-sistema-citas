import pool from '../config/db.js';

export const crearCita = async (req, res) => {
  const { descripcion, cupos_totales, fecha } = req.body;
  
  const cod_usuario_prestador = req.user?.cod || req.user?.usuario?.cod || req.usuario?.cod;

  if (!cod_usuario_prestador) {
    return res.status(400).json({ error: 'No se pudo obtener la identidad del usuario desde el token.' });
  }

  // Verificación de la fecha (no puede ser el mismo día ni anterior)
  const VerificarFechaCita = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (VerificarFechaCita <= hoy) {
    return res.status(400).json({
      message: "La fecha de la cita no puede ser del mismo día ni anterior",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO citas (descripcion, cupos_totales, cupos_disponibles, cod_usuario_prestador, fecha)
       VALUES (?, ?, ?, ?, ?)`,
      [descripcion, cupos_totales, cupos_totales, cod_usuario_prestador, fecha]
    );

    res.status(201).json({ message: "Cita creada exitosamente", id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error al asignar cita", error: error.message });
  }
};