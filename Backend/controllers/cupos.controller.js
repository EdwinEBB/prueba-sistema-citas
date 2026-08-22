import pool from '../config/db.config.js';


    
export const asignarCupo = async (req, res) => {
        const { cod_cita } = req.body;
        const cod_usuario_solicitante = req.user.cod;
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            //regla: maximo 1 cupo por cita y solicitante
            const [CupoExistente] = await connection.query(`
                SELECT * FROM cupos WHERE cod_cita = ? AND cod_usuario_solicitante = ?`,
                [cod_cita, cod_usuario_solicitante]);
            
            if (CupoExistente.length > 0) {
                await connection.rollback();
                return res.status(400).json({ message: 'Ya tienes un cupo asignado para esta cita' });
            }

            const [cita] = await connection.query(`
                SELECT * FROM citas WHERE cod = ? FOR UPDATE`,
                [cod_cita]);
            
            if (cita.length === 0 || cita[0].cupos_disponibles <= 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'No hay cupos disponibles para esta cita' });
            }

            await connection.query(
              `INSERT INTO cupos (cod_cita, cod_usuario_solicitante, usuarios_rolescod_rol, cod_usuario_solicitante_fk)
                 VALUES (?, ?, 1, ?)`,
              [cod_cita, cod_usuario_solicitante, cod_usuario_solicitante],
            );

            await connection.query(
            'UPDATE citas SET cupos_disponibles = cupos_disponibles - 1 WHERE cod = ?',
             [cod_cita]);

            await connection.commit();
    res.json({ message: "Cupo asignado con éxito" });
        } catch (error) {
          await connection.rollback();
          res.status(500).json({ error: err.message });
        } finally {
            connection.release();
        }
}

export const consultarCuposPrestador = async (req, res) => {
  const cod_usuario_prestador = req.usuario.cod;
  try {
    const [cupos] = await pool.query(
      `SELECT c.descripcion as cita_descripcion, c.fecha, u.usuario as solicitante 
       FROM cupos cp
       JOIN citas c ON cp.cod_cita = c.cod
       JOIN usuarios u ON cp.cod_usuario_solicitante = u.cod
       WHERE c.cod_usuario_prestador = ?`,
      [cod_usuario_prestador]
    );
    res.json(cupos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


