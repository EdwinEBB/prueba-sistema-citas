import React, { useState } from 'react';
import api from '../api/axios';

export default function Consultas({ setNotificación }) {
  const [cuposPrestador, setCuposPrestador] = useState([]);
  const [cuposSolicitante, setCuposSolicitante] = useState([]);

  const cargarPrestador = async () => {
    try {
      const res = await api.get('/cupos/prestador');
      setCuposPrestador(res.data);
      if (res.data.length === 0) setNotificación({ tipo: 'info', texto: 'No tienes solicitudes pendientes.' });
    } catch (err) {
      setNotificación({ tipo: 'error', texto: err.response?.data?.error || 'Error al cargar datos' });
    }
  };

  const cargarSolicitante = async () => {
    try {
      const res = await api.get('/cupos/solicitante');
      setCuposSolicitante(res.data);
      if (res.data.length === 0) setNotificación({ tipo: 'info', texto: 'No tienes reservas realizadas.' });
    } catch (err) {
      setNotificación({ tipo: 'error', texto: err.response?.data?.error || 'Error al cargar datos' });
    }
  };

  return (
    <section style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px' }}>
      <h3>5. Consultar Registros</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={cargarPrestador}>Ver Solicitudes Recibidas (Como Prestador)</button>
        <button onClick={cargarSolicitante}>Ver Mis Reservas (Como Solicitante)</button>
      </div>

      {cuposPrestador.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <h4>Solicitudes Recibidas:</h4>
          <ul>
            {cuposPrestador.map((c, i) => (
              <li key={i}>Cita #{c.cita_id}: {c.cita_descripcion} — Solicitante: <strong>{c.solicitante}</strong></li>
            ))}
          </ul>
        </div>
      )}

      {cuposSolicitante.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <h4>Mis Reservas:</h4>
          <ul>
            {cuposSolicitante.map((c, i) => (
              <li key={i}>Cita #{c.cita_id}: {c.cita_descripcion} — Prestador: <strong>{c.prestador}</strong></li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}