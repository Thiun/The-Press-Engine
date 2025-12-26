import React, { useState } from 'react';
import PanelEscritor from './PanelEscritor';
import PublicidadPanel from './PublicidadPanel';
import './Headers.css';

/**
 * HeaderLogWriter
 *
 * Encabezado para usuarios con rol de escritor. Muestra el título de la
 * aplicación, un botón para abrir el panel de escritura y otro para
 * gestionar publicidades. También presenta el nombre del usuario y un botón
 * para cerrar sesión. Cuando se hace clic en los botones, se abren
 * modales con los respectivos paneles.
 */
function HeaderLogWriter({ user, onLogout }) {
  const [showPanel, setShowPanel] = useState(false);
  const [showPublicidad, setShowPublicidad] = useState(false);
  return (
    <>
      <header className="header-all">
        <div className="header-content">
          {/* Logo/Título a la izquierda */}
          <h1 className="header-title">The Press Engine</h1>
          {/* Navegación central para escritores */}
          <nav className="header-nav-center">
            <button
              className="nav-btn escritor-btn"
              onClick={() => setShowPanel(true)}
            >
              ✍️ Panel de Escritura
            </button>
            {/* Botón de publicidad */}
            <button
              className="nav-btn publicidad-btn"
              onClick={() => setShowPublicidad(true)}
            >
              📣 Publicidad
            </button>
          </nav>
          {/* Información de usuario y logout a la derecha */}
          <nav className="header-nav-right">
            <span className="user-info">Escritor: {user?.name}</span>
            <button className="header-btn logout-btn" onClick={onLogout}>
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>
      {/* Modal del Panel de Escritor */}
      {showPanel && (
        <div className="modal-overlay">
          <div className="modal-content panel-modal">
            <button
              className="modal-close"
              onClick={() => setShowPanel(false)}
            >
              ×
            </button>
            <PanelEscritor user={user} />
          </div>
        </div>
      )}
      {/* Modal del Panel de Publicidad */}
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

export default HeaderLogWriter;