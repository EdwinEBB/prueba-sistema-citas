import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginForm({ setNotificación }) {
  const [form, setForm] = useState({ usuario: '', clave: '' });
  const { loginContext } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      loginContext(res.data.token, res.data.usuario);
      setNotificación({ tipo: 'exito', texto: `¡Bienvenido, ${res.data.usuario.usuario}!` });
    } catch (err) {
      setNotificación({ tipo: 'error', texto: err.response?.data?.error || 'Error al iniciar sesión' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h3>Iniciar Sesión</h3>
      <input 
        type="text" 
        placeholder="Usuario" 
        value={form.usuario} 
        onChange={(e) => setForm({ ...form, usuario: e.target.value })} 
        required 
      />
      <input 
        type="password" 
        placeholder="Contraseña" 
        value={form.clave} 
        onChange={(e) => setForm({ ...form, clave: e.target.value })} 
        required 
      />
      <button type="submit">Ingresar</button>
    </form>
  );
}