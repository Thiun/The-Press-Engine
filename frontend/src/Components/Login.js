import React, { useState } from 'react';
import './Login.css';

/**
 * Login component responsible for authenticating a user. Displays a simple
 * form with email and password fields. On submit it performs a POST
 * request to the backend and invokes the optional onLogin callback
 * with the returned session data. An error message is shown when the
 * credentials are invalid or the server cannot be reached.
 *
 * @param {Function} onLogin Callback invoked with session data when login succeeds
 */
function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle changes in the input fields. Updates local form state and
   * clears any existing error.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  /**
   * Submit the login form. Sends the credentials to the backend and
   * handles the response. On success, it resets the form and calls
   * the provided onLogin handler. On failure, an error message is set.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (onLogin) {
          onLogin(data);
        }
        setFormData({ email: '', password: '' });
      } else {
        // Attempt to parse JSON error body; if not JSON then use plain text
        const errorBody = await response.json().catch(async () => ({ message: await response.text() }));
        setError(errorBody.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <p className="login-subtitle">Accede a tu cuenta de The Press Engine</p>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
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
            placeholder="Ingresa tu contraseña"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      <div className="login-links">
        <p>¿No tienes cuenta? <a href="#" onClick={(e) => {e.preventDefault(); /* handled by HeaderNoLog */}}>Regístrate aquí</a></p>
      </div>
    </div>
  );
}

export default Login;