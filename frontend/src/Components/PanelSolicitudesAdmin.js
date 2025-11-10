
import React, { useState, useEffect } from 'react';
import './PanelSolicitudes.css';

function PanelSolicitudesAdmin() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar solicitudes del backend
  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/solicitudes');
      const data = await response.json();
      setSolicitudes(data);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const manejarAprobacion = async (solicitudId, aprobado) => {
    try {
      const response = await fetch(`http://localhost:8080/api/solicitudes/${solicitudId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: aprobado ? 'APROBADA' : 'RECHAZADA'
        })
      });

      if (response.ok) {
        fetchSolicitudes(); // Recargar lista
        alert(`Solicitud ${aprobado ? 'aprobada' : 'rechazada'} correctamente`);
      }
    } catch (error) {
      console.error('Error actualizando solicitud:', error);
    }
  };

  if (loading) return <div>Cargando solicitudes...</div>;

  return (
    <div className="panel-solicitudes">
      <h2>📋 Solicitudes de Escritores</h2>
      
      {solicitudes.length === 0 ? (
        <p>No hay solicitudes pendientes</p>
      ) : (
        <div className="solicitudes-list">
          {solicitudes.map(solicitud => (
            <div key={solicitud.id} className="solicitud-card">
              <div className="solicitud-header">
                <h3>{solicitud.userName}</h3>
                <span className={`estado ${solicitud.estado}`}>
                  {solicitud.estado}
                </span>
              </div>
              
              <p className="solicitud-email">{solicitud.userEmail}</p>
              <p className="solicitud-fecha">
                {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
              </p>
              
              <div className="solicitud-motivacion">
                <strong>Motivación:</strong>
                <p>{solicitud.motivacion}</p>
              </div>

              {solicitud.estado === 'pendiente' && (
                <div className="solicitud-actions">
                  <button 
                    className="btn-aprobar"
                    onClick={() => manejarAprobacion(solicitud.id, true)}
                  >
                    ✅ Aprobar
                  </button>
                  <button 
                    className="btn-rechazar"
                    onClick={() => manejarAprobacion(solicitud.id, false)}
                  >
                    ❌ Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PanelSolicitudesAdmin;