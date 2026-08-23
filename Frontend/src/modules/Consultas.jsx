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
        
        const res = await api.get('/cupos/prestador');
        setSolicitudesRecibidas(Array.isArray(res.data) ? res.data : []);
      } else {
       
        const [resDisponibles, resMisReservas] = await Promise.all([
          api.get('/cupos/solicitante'),
          api.get('/cupos/mis-reservas')
        ]);
        setCitasDisponibles(Array.isArray(resDisponibles.data) ? resDisponibles.data : []);
        setMisReservas(Array.isArray(resMisReservas.data) ? resMisReservas.data : []);
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar la información.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [esUsuarioPrestador]);

  
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
      cargarDatos(); 
    } catch (err) {
      alert(err.response?.data?.error || 'Error al suscribirse.');
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Cargando información...</div>;
  if (error) return <div className="p-4 text-red-500 font-semibold">{error}</div>;


  if (esUsuarioPrestador) {
    return (
      <div className="p-4 space-y-6">
        <div className="border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">Panel de Prestador</h2>
          <p className="text-sm text-gray-500">Gestión de citas creadas y cupos asignados</p>
        </div>

        {solicitudesRecibidas.length === 0 ? (
          <p className="text-gray-500">No has creado citas aún o no hay solicitudes asignadas.</p>
        ) : (
          <ul className="space-y-3">
            {solicitudesRecibidas.map((cita, idx) => (
              <li key={cita.cita_id || idx} className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-800">Cita #{cita.cita_id}: {cita.cita_descripcion || cita.descripcion}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Reservado por:</strong> {cita.solicitante ? cita.solicitante : <em className="text-gray-400">Sin reservas</em>}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded font-semibold">
                    Cupos: {cita.cupos_disponibles ?? 0} / {cita.cupos_totales ?? 0}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      
      <section className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="font-bold text-lg mb-2 text-gray-800">Suscribirse a un Prestador</h3>
        <form onSubmit={handleSuscribir} className="flex gap-2">
          <input
            type="text"
            placeholder="Código del Prestador"
            value={codPrestadorSuscribir}
            onChange={(e) => setCodPrestadorSuscribir(e.target.value)}
            className="border p-2 rounded w-full max-w-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
            Suscribirse
          </button>
        </form>
      </section>

      
      <section>
        <h3 className="font-bold text-lg mb-3 text-gray-800">Citas Disponibles para Reservar</h3>
        {citasDisponibles.length === 0 ? (
          <p className="text-gray-500">No hay citas disponibles de tus prestadores suscritos.</p>
        ) : (
          <ul className="space-y-3">
            {citasDisponibles.map((cita) => (
              <li key={cita.cita_id} className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-800">{cita.descripcion}</h4>
                  <p className="text-sm text-gray-600">Prestador: <strong>{cita.prestador_usuario}</strong></p>
                  <p className="text-xs text-gray-500 mt-1">Cupos disponibles: {cita.cupos_disponibles}</p>
                </div>
                <button
                  onClick={() => handleReservar(cita.cita_id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Reservar Cupo
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      
      <section>
        <h3 className="font-bold text-lg mb-3 text-gray-800">Mis Reservas Confirmadas</h3>
        {misReservas.length === 0 ? (
          <p className="text-gray-500">Aún no has reservado ninguna cita.</p>
        ) : (
          <ul className="space-y-2">
            {misReservas.map((reserva, idx) => (
              <li key={`${reserva.cita_id}-${idx}`} className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-800">Cita #{reserva.cita_id}:</span> {reserva.cita_descripcion}
                </div>
                <span className="text-sm text-gray-600">
                  Prestador: <strong>{reserva.prestador}</strong>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Consultas;