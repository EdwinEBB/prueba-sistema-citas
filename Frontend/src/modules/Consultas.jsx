import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { esPrestador } from '../utils/auth';

const Consultas = () => {
  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState([]);
  const [citasDisponibles, setCitasDisponibles] = useState([]);
  const [misReservas, setMisReservas] = useState([]);
  const [codPrestadorSuscribir, setCodPrestadorSuscribir] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const esUsuarioPrestador = esPrestador();

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      if (esUsuarioPrestador) {
        // Carga para el Prestador
        const res = await api.get('/cupos/prestador');
        setSolicitudesRecibidas(Array.isArray(res.data) ? res.data : []);
      } else {
        // Carga para el Solicitante
        const [resDisponibles, resMisReservas] = await Promise.all([
          api.get('/cupos/solicitante'),
          api.get('/cupos/mis-reservas')
        ]);
        setCitasDisponibles(Array.isArray(resDisponibles.data) ? resDisponibles.data : []);
        setMisReservas(Array.isArray(resMisReservas.data) ? resMisReservas.data : []);
      }
    } catch (err) {
      setError('Error al cargar la información.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [esUsuarioPrestador]);

  // Acciones del Solicitante
  const handleReservar = async (cod_cita) => {
    try {
      await api.post('/cupos/asignar', { cod_cita });
      alert('Cupo reservado con éxito');
      cargarDatos();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al reservar el cupo.');
    }
  };

  const handleSuscribir = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cupos/suscribir', { cod_usuario_prestador: codPrestadorSuscribir });
      alert('Te has suscrito al prestador correctamente');
      setCodPrestadorSuscribir('');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al suscribirse.');
    }
  };

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500 font-semibold">{error}</div>;

  // ==========================================
  // VISTA PRESTADOR
  // ==========================================
  if (esUsuarioPrestador) {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Panel de Prestador: Citas Publicadas</h2>
        {solicitudesRecibidas.length === 0 ? (
          <p className="text-gray-500">No has publicado citas aún.</p>
        ) : (
          <ul className="space-y-3">
            {solicitudesRecibidas.map((cita, idx) => (
              <li key={`${cita.cita_id}-${idx}`} className="p-4 border rounded bg-white shadow-sm">
                <div><strong>Cita #{cita.cita_id}:</strong> {cita.cita_descripcion}</div>
                <div><strong>Solicitante:</strong> {cita.solicitante || <em className="text-gray-400">Sin reservas aún</em>}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Cupos disponibles: {cita.cupos_disponibles} / {cita.cupos_totales}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // ==========================================
  // VISTA SOLICITANTE / VISITANTE
  // ==========================================
  return (
    <div className="p-4 space-y-8">
      {/* 1. Suscribirse a un prestador */}
      <section className="p-4 border rounded bg-white shadow-sm">
        <h3 className="font-bold text-lg mb-2">Suscribirse a un Prestador</h3>
        <form onSubmit={handleSuscribir} className="flex gap-2">
          <input
            type="text"
            placeholder="Código del Prestador"
            value={codPrestadorSuscribir}
            onChange={(e) => setCodPrestadorSuscribir(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
            required
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
            Suscribirse
          </button>
        </form>
      </section>

      {/* 2. Citas Disponibles para Reservar */}
      <section>
        <h3 className="font-bold text-lg mb-2">Citas Disponibles</h3>
        {citasDisponibles.length === 0 ? (
          <p className="text-gray-500">No hay citas disponibles para reservar.</p>
        ) : (
          <ul className="space-y-3">
            {citasDisponibles.map((cita) => (
              <li key={cita.cita_id} className="p-4 border rounded bg-white shadow-sm flex justify-between items-center">
                <div>
                  <strong>{cita.descripcion}</strong>
                  <div className="text-sm text-gray-600">Prestador: {cita.prestador_usuario}</div>
                  <div className="text-xs text-gray-500">Cupos libres: {cita.cupos_disponibles}</div>
                </div>
                <button
                  onClick={() => handleReservar(cita.cita_id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Reservar Cupo
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 3. Reservas realizadas */}
      <section>
        <h3 className="font-bold text-lg mb-2">Mis Reservas</h3>
        {misReservas.length === 0 ? (
          <p className="text-gray-500">No has reservado citas.</p>
        ) : (
          <ul className="space-y-2">
            {misReservas.map((reserva, idx) => (
              <li key={`${reserva.cita_id}-${idx}`} className="p-3 border rounded bg-gray-50">
                <strong>Cita #{reserva.cita_id}:</strong> {reserva.cita_descripcion} —{' '}
                <span>Prestador: <strong>{reserva.prestador}</strong></span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Consultas;