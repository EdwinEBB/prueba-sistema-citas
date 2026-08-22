import pool from '../config/db.config.js';

export const crearCita = async (req, res) => {

const { descripcion, cupos_totales, fecha } = req.body;
const cod_usuario_prestador = req.usuario.cod;

// Verificación de la fecha (ya que no puede ser el mismo día)
const VerificarFechaCita = new Date(fecha);
const hoy = new Date();
hoy.setHours(0, 0, 0, 0); // esto equivale a la media noche del día de hoy

if (VerificarFechaCita <= hoy) {
  return res
    .status(400)
    .json({
      message: "La fecha de la cita no puede del mismo día ni de antes",
    });
}

try {
    const [result] = await pool.query(`
        INSERT INTO citas (descripcion, cupos_totales, cupos_disponibles, cod_usuario_prestador, fecha)
        VALUES (?, ?, ?, ?, ?)`,
        [descripcion, cupos_totales, cupos_totales, cod_usuario_prestador, fecha]);
    res
      .status(201)
      .json({ message: "Cita creada exitosamente", id: result.insertId });
} catch (error) {
    res.status(500).json({message: "Error al asignar cita", error: error.message})
}
}