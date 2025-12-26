import React, { useState } from 'react';
import SolicitudTrabajoModal from './SolicitudTrabajoModal';
import PublicidadPanel from './PublicidadPanel';
import './Headers.css';

/**
 * HeaderLogLector
 *
 * Encabezado para usuarios con rol de lector. Permite enviar una solicitud
 * para convertirse en escritor y gestionar publicidades. Muestra el nombre
 * del usuario y un botón para cerrar sesión. Cada opción se abre en un
 * modal independiente.
 */
function HeaderLogLector({ onSolicitudTrabajo, onLogout, user }) {
  const [showModal, setShowModal] = useState(false);
  const [showPublicidad, setShowPublicidad] = useState(false);
  const handleSolicitudClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleSubmitSolicitud = async (solicitudData) => {
    if (onSolicitudTrabajo) {
      await onSolicitudTrabajo(solicitudData);
    }
  };
  return (
    <>
      <header className="header-all">
        <div className="header-content">
          <h1 className="header-title">The Press Engine</h1>
          <nav className="header-nav-center">
            <button
              className="nav-btn trabajo-btn"
              onClick={handleSolicitudClick}
            >
              💼 Solicitar ser Escritor
            </button>
            {/* Botón de publicidad */}
            <button
              className="nav-btn publicidad-btn"
              onClick={() => setShowPublicidad(true)}
            >
              📣 Publicidad
            </button>
          </nav>
          <nav className="header-nav-right">
            <span className="user-info">
              Hola, {user?.name || 'Lector'}
            </span>
            <button className="header-btn logout-btn" onClick={onLogout}>
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>
      <SolicitudTrabajoModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitSolicitud}
        user={user}
      />
      {/* Modal de Publicidad */}
      {showPublicidad && (
        <div className="modal-overlay">
          <div className="modal-content panel-modal">
            <button
              className="modal-close"
              onClick={() => setShowPublicidad(false)}
            >
              ×
            </button>
            <PublicidadPanel user={user} />
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderLogLector;