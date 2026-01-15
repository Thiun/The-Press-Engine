import React, { useState } from 'react';
import './PublicidadPanel.css';

/**
 * PublicidadPanel
 *
 * Permite a lectores y escritores solicitar una publicidad. Envía la
 * solicitud al backend para revisión del administrador.
 *
 * Props:
 *  - user (Object): usuario autenticado
 */
function PublicidadPanel({ user }) {
  const [form, setForm] = useState({
    brand: '',
    description: '',
    durationDays: 7,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'durationDays' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brand.trim() || !form.description.trim()) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    if (!user?.id) {
      setError('No se pudo identificar al usuario.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const response = await fetch('http://localhost:8080/api/advertisements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: form.brand.trim(),
          description: form.description.trim(),
          durationDays: form.durationDays,
          userId: user.id,
          userName: user.name || 'Usuario',
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'No se pudo enviar la solicitud.');
      }

      setSuccess('✅ Solicitud enviada. El administrador la revisará pronto.');
      setForm({ brand: '', description: '', durationDays: 7 });
    } catch (err) {
      setError(err.message || 'Ocurrió un error al enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publicidad-panel">
      <h2>📣 Solicitar Publicidad</h2>
      <p className="publicidad-subtitle">
        Completa la información para que podamos revisar tu solicitud.
      </p>
      <form className="publicidad-form" onSubmit={handleSubmit}>
        <label>
          Marca *
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Nombre de la marca"
            maxLength={120}
            required
          />
        </label>
        <label>
          Descripción *
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe tu publicidad"
            rows={4}
            maxLength={500}
            required
          />
        </label>
        <label>
          Duración (días)
          <input
            type="number"
            name="durationDays"
            min={1}
            max={365}
            value={form.durationDays}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>
      {error && <p className="publicidad-error">{error}</p>}
      {success && <p className="publicidad-success">{success}</p>}
    </div>
  );
}

export default PublicidadPanel;
