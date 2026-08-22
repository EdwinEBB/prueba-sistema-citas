import pool from '../config/db.config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const registrarUsuario = async(req, res) => {
    const { usuario, clave, razon_social } = req.body;
    try {
        const hash= await bcrypt.hash(clave, 10);
        const [result] = await pool.query('INSERT INTO usuarios (usuario, clave, razon_social) VALUES (?, ?, ?)', [usuario, hash, razon_social]);
        res.status(201).json({ message: 'Usuario registrado exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
};

export const login = async(req, res) => {
    const { usuario, clave } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        const user = rows[0];
        const ClaveValida = await bcrypt.compare(clave, user.clave);

        if (!ClaveValida) return res.status(401).json({ message: 'Contraseña incorrecta' });
        const [roles] = await pool.query(`
            SELECT r.nombre FROM roles r
            JOIN usuario_roles ur ON r.cod = ur.cod_rol
            WHERE ur.usuario_cod = ?`, [user.cod]);

        const token = jwt.sign(
            { cod: user.cod, usuario: user.usuario, roles: roles},
             process.env.JWT_SECRET || 'scrsc2108', 
             { expiresIn: '1h' });

        res.json({ token, usuario: {cod:user.cod, usuario:user.usuario, roles} });
     } catch (error) {
        res.status(500).json({message: 'Error al iniciar sesión', error:error.message});
    }
}

export const asignarPerfil = async (req, res) => {
  const { cod_usuario, cod_rol } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `INSERT INTO usuario_roles (cod_usuario, cod_rol) VALUES (?, ?)`,
      [cod_usuario, cod_rol],
    );

    if (parseInt(cod_rol) === 1) {
      await connection.query(
        `INSERT IGNORE INTO solicitantes (cod_usuario) VALUES (?)`,
        [cod_usuario],
      );
    } else if (parseInt(cod_rol) === 2) {
      await connection.query(
        `INSERT IGNORE INTO prestadores (cod_usuario) VALUES (?)`,
        [cod_usuario],
      );
    }

    await connection.commit();
    res.status(200).json({ message: "Perfil asignado exitosamente" });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ message: "Error al asignar perfil", error: error.message });
  } finally {
    connection.release();
  }
};

