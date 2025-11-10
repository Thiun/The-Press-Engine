import React, { useState } from 'react';
import './Register.css';

function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (onRegister) {
          onRegister(data);
        }
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setError('');
      } else {
        const errorBody = await response.json().catch(async () => ({ message: await response.text() }));
        setError(errorBody.message || 'No se pudo completar el registro');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Registrarse</h2>
      <p className="register-subtitle">Únete a The Press Engine como lector</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Nombre completo:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ingresa tu nombre"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="ejemplo@correo.com"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Mínimo 8 caracteres"
            minLength="8"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Confirmar contraseña:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Repite tu contraseña"
            disabled={loading}
          />
        </div>

        <div className="role-info">
          <strong>Tipo de usuario: LECTOR</strong>
          <p>Podrás leer artículos y pronto comentarás</p>
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}

export default Register;