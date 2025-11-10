import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Headers.css';

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
    // Opcional: mostrar mensaje o redirigir a login
    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
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
            <Login 
              onLogin={handleLoginSuccess}
            />
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
            <Register 
              onRegister={handleRegisterSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderNoLog;