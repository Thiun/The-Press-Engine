import React, { useState } from 'react';
import PanelEscritor from './PanelEscritor';
import './Headers.css';

function HeaderLogWriter({ user, onLogout, onNavegacion }) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <header className="header-all">
        <div className="header-content">
          {/* Logo/Título a la izquierda */}
          <h1 className="header-title">The Press Engine</h1>
          
          {/* Navegación central para escritores */}
          <nav className="header-nav-center">
            <button 
              className="nav-btn"
              onClick={() => onNavegacion('noticias')}
            >
              📰 Ver Noticias
            </button>
            <button 
              className="nav-btn escritor-btn"
              onClick={() => setShowPanel(true)}
            >
              ✍️ Panel Escritor
            </button>
          </nav>

          {/* Información de usuario y logout a la derecha */}
          <nav className="header-nav-right">
            <span className="user-info">Escritor: {user?.name}</span>
            <button 
              className="header-btn logout-btn"
              onClick={onLogout}
            >
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
            <PanelEscritor 
              user={user}
              onClose={() => setShowPanel(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderLogWriter;