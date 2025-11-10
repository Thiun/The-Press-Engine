import React, { useState } from 'react';
import './SolicitudModal.css';

function SolicitudTrabajoModal({ isOpen, onClose, onSubmit, user }) {
  const [motivacion, setMotivacion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ✅ VERIFICAR que user existe antes de usarlo
    if (!user || !user.id) {
      alert('Error: Información de usuario no disponible');
      return;
    }
    
    if (motivacion.trim().length < 10) {
      alert('Por favor, escribe una motivación de al menos 10 caracteres');
      return;
    }

    const solicitud = {
      userId: user.id, // ✅ Ahora user está verificado
      userName: user.name || 'Usuario',
      userEmail: user.email || 'No especificado',
      motivacion: motivacion,
      fechaSolicitud: new Date().toISOString(),
      estado: 'pendiente'
    };

    if (onSubmit) {
      onSubmit(solicitud);
    }

    setMotivacion('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content solicitud-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>💼 Solicitar ser Escritor</h2>
        <p className="modal-description">
          Completa este formulario para solicitar convertirte en escritor. 
          Tu solicitud será revisada por los administradores.
        </p>

        <form onSubmit={handleSubmit} className="solicitud-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input 
              type="text" 
              value={user?.name || 'No disponible'} // ✅ Usar optional chaining
              disabled 
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              value={user?.email || 'No disponible'} // ✅ Usar optional chaining
              disabled 
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="motivacion">
              Motivación * 
              <span className="char-count">({motivacion.length}/500)</span>
            </label>
            <textarea
              id="motivacion"
              value={motivacion}
              onChange={(e) => setMotivacion(e.target.value)}
              placeholder="Explica por qué quieres ser escritor, tu experiencia, intereses..."
              required
              maxLength={500}
              rows={5}
            />
            <div className="char-hint">Mínimo 10 caracteres</div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SolicitudTrabajoModal;