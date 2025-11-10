import React, { useState } from 'react';
import SolicitudTrabajoModal from './SolicitudTrabajoModal';
import './Headers.css';

function HeaderLogLector({ onSolicitudTrabajo, onLogout, user }) {
  const [showModal, setShowModal] = useState(false);

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
          </nav>

          <nav className="header-nav-right">
            <span className="user-info">Hola, {user?.name || 'Lector'}</span>
            <button 
              className="header-btn logout-btn"
              onClick={onLogout}
            >
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
    </>
  );
}

export default HeaderLogLector;