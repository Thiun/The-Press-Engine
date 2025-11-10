import React, { useState } from 'react';
import './Register.css';
// Componente de registro de usuario, meter logica para ver si el usuario ya esta registrado en el backend
function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }


    const userObject = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'READER', // FIJO - solo lectores
      createdAt: new Date().toISOString()
    };

    if (onRegister) {
      onRegister(userObject);
    }

   
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="register-container">
      <h2>Registrarse</h2>
      <p className="register-subtitle">Únete a The Press Engine como lector</p>
      
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
          />
        </div>

        <div className="role-info">
          <strong>Tipo de usuario: LECTOR</strong>
          <p>Podrás leer artículos y pronto comentarás</p>
        </div>

        <button type="submit" className="register-button">
          Registrarse 
        </button>
      </form>
    </div>
  );
}

export default Register;