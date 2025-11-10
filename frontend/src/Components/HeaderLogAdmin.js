import React, { useState } from 'react';
import PanelAdmin from './PanelAdmin';
import './Headers.css';

function HeaderLogAdmin({ user, onLogout, onNavegacion }) {
  const [showPanel, setShowPanel] = useState(false);

  const handleNavegacion = (section) => {
    if (onNavegacion && typeof onNavegacion === 'function') {
      onNavegacion(section);
    }
  };

  return (
    <>
      <header className="header-all">
        <div className="header-content">
          {/* Logo/Título a la izquierda */}
          <h1 className="header-title">The Press Engine</h1>
          
          {/* Navegación central para administradores */}
          <nav className="header-nav-center">
            <button 
              className="nav-btn"
              onClick={() => handleNavegacion('noticias')}
            >
              📰 Ver Noticias
            </button>
            <button 
              className="nav-btn admin-btn"
              onClick={() => setShowPanel(true)}
            >
              ⚙️ Panel Admin
            </button>
          </nav>

          {/* Información de usuario y logout a la derecha */}
          <nav className="header-nav-right">
            <span className="user-info admin-info">Admin: {user?.name}</span>
            <button 
              className="header-btn logout-btn"
              onClick={onLogout}
            >
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>

      {/* Modal del Panel de Administrador */}
      {showPanel && (
        <div className="modal-overlay">
          <div className="modal-content panel-modal admin-modal">
            <button 
              className="modal-close"
              onClick={() => setShowPanel(false)}
            >
              ×
            </button>
            <PanelAdmin 
              user={user}
              onClose={() => setShowPanel(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderLogAdmin;