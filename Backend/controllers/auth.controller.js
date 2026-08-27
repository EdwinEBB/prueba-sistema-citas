import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const registrarUsuario = async(req, res) => {
    const { usuario, clave, razon_social } = req.body;
    try {
      const hash = await bcrypt.hash(clave, 10);
      const [result] = await pool.query(
        "INSERT INTO usuarios (usuario, clave, razon_social) VALUES (?, ?, ?)",
        [usuario, hash, razon_social],
      );
      res.status(201).json({
        message: "Usuario registrado exitosamente",
        id: result.insertId,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al registrar usuario", error: error.message });
    }
};

export const login = async (req, res) => {
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
            SELECT r.cod AS cod_rol, r.descripcion AS nom_rol 
            FROM roles r
            JOIN usuarios_roles ur ON r.cod = ur.cod_rol
            WHERE ur.cod_usuario = ?`, [user.cod]);

        // Si no tiene roles asignados, el valor debe ser null
        const primerRol = roles.length > 0 ? roles[0] : null;

        const tokenPayload = {
            cod: user.cod,
            usuario: user.usuario,
            cod_rol: primerRol ? primerRol.cod_rol : null,
            rol: primerRol ? primerRol.nom_rol : null,
            roles: roles
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'scrsc2108', 
            { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            usuario: {
                cod: user.cod, 
                usuario: user.usuario, 
                cod_rol: primerRol ? primerRol.cod_rol : null,
                rol: primerRol ? primerRol.nom_rol : null,
                roles: roles
            } 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
}

export const asignarPerfil = async (req, res) => {
  const { cod_usuario, cod_rol } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `INSERT IGNORE INTO usuarios_roles (cod_usuario, cod_rol) VALUES (?, ?)`,
      [cod_usuario, cod_rol]
    );

    if (parseInt(cod_rol) === 1) {
      await connection.query(
        `INSERT IGNORE INTO solicitantes (cod_usuario) VALUES (?)`,
        [cod_usuario]
      );
    } else if (parseInt(cod_rol) === 2) {
      await connection.query(
        `INSERT IGNORE INTO prestadores (cod_usuario) VALUES (?)`,
        [cod_usuario]
      );
    }

    await connection.commit();

    const [userRows] = await pool.query('SELECT * FROM usuarios WHERE cod = ?', [cod_usuario]);
    const user = userRows[0];

    const [roles] = await pool.query(`
      SELECT r.cod AS cod_rol, r.descripcion AS nom_rol 
      FROM roles r
      JOIN usuarios_roles ur ON r.cod = ur.cod_rol
      WHERE ur.cod_usuario = ?`, [cod_usuario]);

    const primerRol = roles[0] || { cod_rol, nom_rol: cod_rol == 1 ? 'Solicitante' : 'Prestador' };

    const tokenPayload = {
      cod: user.cod,
      usuario: user.usuario,
      cod_rol: primerRol.cod_rol,
      rol: primerRol.nom_rol,
      roles: roles
    };

    const nuevoToken = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'scrsc2108',
      { expiresIn: '1h' }
    );

    const usuarioData = {
      cod: user.cod,
      usuario: user.usuario,
      cod_rol: primerRol.cod_rol,
      rol: primerRol.nom_rol,
      roles: roles
    };

    res.status(200).json({ 
      message: "Perfil asignado exitosamente",
      token: nuevoToken,
      usuario: usuarioData
    });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Error al asignar perfil", error: error.message });
  } finally {
    connection.release();
  }
};

