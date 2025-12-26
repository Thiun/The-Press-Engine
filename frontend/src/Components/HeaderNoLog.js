import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Headers.css';

/**
 * HeaderNoLog
 *
 * Encabezado para usuarios no autenticados. Permite iniciar sesión
 * o registrarse. Al hacer clic en cualquiera de los botones se abre un
 * modal con el formulario correspondiente. Cuando el login es exitoso,
 * se comunica al componente padre a través de la prop onLoginSuccess.
 */
function HeaderNoLog({ onLoginSuccess }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const handleLoginSuccess = (userData) => {
    setShowLogin(false);
    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }
  };
  const handleRegisterSuccess = () => {
    setShowRegister(false);
    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    setShowLogin(true);
  };
  return (
    <>
      <header className="header-all">
        <div className="header-content">
          <h1 className="header-title">The Press Engine</h1>
          <nav className="header-nav">
            <button
              className="header-btn login-btn"
              onClick={() => setShowLogin(true)}
            >
              Iniciar Sesión
            </button>
            <button
              className="header-btn register-btn"
              onClick={() => setShowRegister(true)}
            >
              Registrarse
            </button>
          </nav>
        </div>
      </header>
      {/* Modal de Login */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>
            <Login onLogin={handleLoginSuccess} />
          </div>
        </div>
      )}
      {/* Modal de Register */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowRegister(false)}
            >
              ×
            </button>
            <Register onRegister={handleRegisterSuccess} />
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderNoLog;