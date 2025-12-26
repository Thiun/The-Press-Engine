import React, { useState } from 'react';
import './SolicitudModal.css';

/**
 * SolicitudTrabajoModal
 *
 * Modal que permite a los lectores solicitar convertirse en escritores.
 * Incluye un formulario para introducir un motivo. El usuario y su ID se
 * incluyen en la solicitud enviada al backend. Se muestra únicamente
 * cuando la prop isOpen es true.
 *
 * Props:
 *  - isOpen (boolean): control de visibilidad del modal
 *  - onClose (function): callback para cerrar el modal
 *  - onSubmit (function): callback para enviar la solicitud
 *  - user (Object): usuario autenticado
 */
function SolicitudTrabajoModal({ isOpen, onClose, onSubmit, user }) {
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      alert('Error: Información de usuario no disponible');
      return;
    }
    if (motivo.trim().length < 10) {
      alert('Por favor, escribe un motivo de al menos 10 caracteres');
      return;
    }
    const solicitud = {
      userId: user.id,
      userName: user.name || 'Usuario',
      userEmail: user.email || 'No especificado',
      motivo: motivo,
    };
    try {
      setLoading(true);
      setError('');
      if (onSubmit) {
        await onSubmit(solicitud);
      }
      setMotivo('');
      onClose();
    } catch (err) {
      setError(err.message || 'No se pudo enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content solicitud-modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>💼 Solicitar ser Escritor</h2>
        <p className="modal-description">
          Completa este formulario para solicitar convertirte en escritor. Tu
          solicitud será revisada por los administradores.
        </p>
        <form onSubmit={handleSubmit} className="solicitud-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={user?.name || 'No disponible'}
              disabled
              className="disabled-input"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={user?.email || 'No disponible'}
              disabled
              className="disabled-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="motivo">
              Motivo * <span className="char-count">({motivo.length}/500)</span>
            </label>
            <textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Explica por qué quieres ser escritor, tu experiencia, intereses..."
              required
              maxLength={500}
              rows={5}
              disabled={loading}
            />
            <div className="char-hint">Mínimo 10 caracteres</div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default SolicitudTrabajoModal;