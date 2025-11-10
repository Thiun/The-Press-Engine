import React, { useState, useEffect } from 'react';
import './PanelAdmin.css';

function PanelAdmin({ user, onClose }) {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [solicitudesEscritores, setSolicitudesEscritores] = useState([]);
  const [noticiasPendientes, setNoticiasPendientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackByPost, setFeedbackByPost] = useState({});
  const [deleteReasons, setDeleteReasons] = useState({});

  // Cargar datos según la pestaña activa
  useEffect(() => {
    switch(activeTab) {
      case 'solicitudes':
        fetchSolicitudesEscritores();
        break;
      case 'noticias':
        fetchNoticiasPendientes();
        break;
      case 'usuarios':
        fetchUsuarios();
        break;
      default:
        break;
    }
  }, [activeTab]);

  // Cargar solicitudes de escritores
  const fetchSolicitudesEscritores = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/solicitudes');
      if (response.ok) {
        const data = await response.json();
        setSolicitudesEscritores(data);
      }
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar noticias pendientes
  const fetchNoticiasPendientes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/posts/pendientes');
      if (response.ok) {
        const data = await response.json();
        setNoticiasPendientes(data);
        setFeedbackByPost({});
        setDeleteReasons({});
      }
    } catch (error) {
      console.error('Error cargando noticias:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar aprobación/rechazo de solicitudes de escritores
  const manejarSolicitudEscritor = async (solicitudId, aprobado) => {
    try {
      const response = await fetch(`http://localhost:8080/api/solicitudes/${solicitudId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: aprobado ? 'APROBADA' : 'RECHAZADA'
        })
      });

      if (response.ok) {
        // Actualizar rol del usuario si es aprobado
        if (aprobado) {
          await actualizarRolUsuario(solicitudId, 'WRITER');
        }
        
        fetchSolicitudesEscritores();
        alert(`Solicitud ${aprobado ? 'aprobada' : 'rechazada'} correctamente`);
      }
    } catch (error) {
      console.error('Error actualizando solicitud:', error);
    }
  };

  // Actualizar rol de usuario
  const actualizarRolUsuario = async (solicitudId, nuevoRol) => {
    try {
      // Primero obtener la solicitud para saber el userId
      const solicitud = solicitudesEscritores.find(s => s.id === solicitudId);
      if (solicitud) {
        const response = await fetch(`http://localhost:8080/api/users/${solicitud.userId}/role`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: nuevoRol })
        });

        if (!response.ok) {
          console.error('Error actualizando rol de usuario');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Manejar aprobación/rechazo de noticias
  const manejarNoticia = async (noticiaId, aprobado) => {
    try {
      const feedbackValue = feedbackByPost[noticiaId] || '';
      const response = await fetch(`http://localhost:8080/api/posts/${noticiaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: aprobado ? 'APPROVED' : 'REJECTED',
          feedback: aprobado ? null : feedbackValue || null
        })
      });

      if (response.ok) {
        fetchNoticiasPendientes();
        alert(`Noticia ${aprobado ? 'aprobada' : 'rechazada'} correctamente`);
        setFeedbackByPost(prev => ({ ...prev, [noticiaId]: '' }));
      }
    } catch (error) {
      console.error('Error actualizando noticia:', error);
    }
  };

  const handleFeedbackChange = (postId, value) => {
    setFeedbackByPost(prev => ({ ...prev, [postId]: value }));
  };

  const handleDeleteReasonChange = (postId, value) => {
    setDeleteReasons(prev => ({ ...prev, [postId]: value }));
  };

  // Eliminar noticia
  const eliminarNoticia = async (noticiaId, razon) => {
    if (!razon.trim()) {
      alert('Por favor, proporciona una razón para la eliminación');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${noticiaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          deleteReason: razon
        })
      });

      if (response.ok) {
        fetchNoticiasPendientes();
        alert('Noticia eliminada correctamente');
        setDeleteReasons(prev => ({ ...prev, [noticiaId]: '' }));
      }
    } catch (error) {
      console.error('Error eliminando noticia:', error);
    }
  };

  // Manejar usuarios
  const manejarUsuario = async (userId, accion) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion }) // BAN, UNBAN, DELETE, etc.
      });

      if (response.ok) {
        fetchUsuarios();
        alert('Usuario actualizado correctamente');
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  };

  const solicitudesPendientes = solicitudesEscritores.filter(
    (solicitud) => solicitud.estado === 'pendiente'
  );

  return (
    <div className="panel-admin">
      <h2>⚙️ Panel de Administración</h2>

      {/* Tabs de navegación */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'solicitudes' ? 'active' : ''}`}
          onClick={() => setActiveTab('solicitudes')}
        >
          👥 Solicitudes ({solicitudesPendientes.length})
        </button>
        <button 
          className={`tab ${activeTab === 'noticias' ? 'active' : ''}`}
          onClick={() => setActiveTab('noticias')}
        >
          📰 Noticias Pendientes ({noticiasPendientes.length})
        </button>
        <button 
          className={`tab ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          🔧 Gestión de Usuarios ({usuarios.length})
        </button>
      </div>

      {/* Contenido de las tabs */}
      <div className="tab-content">
        
        {/* TAB: Solicitudes de Escritores */}
        {activeTab === 'solicitudes' && (
          <div className="solicitudes-list">
            {loading ? (
              <div className="loading">Cargando solicitudes...</div>
            ) : solicitudesPendientes.length === 0 ? (
              <div className="empty-state">
                <p>✅ No hay solicitudes pendientes</p>
              </div>
            ) : (
              solicitudesPendientes.map(solicitud => (
                <div key={solicitud.id} className="solicitud-card">
                  <div className="solicitud-header">
                    <h3>{solicitud.userName}</h3>
                    <span className="solicitud-email">{solicitud.userEmail}</span>
                  </div>
                  
                  <div className="solicitud-meta">
                    <span className="fecha">
                      📅 {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="solicitud-motivacion">
                    <strong>Motivación:</strong>
                    <p>{solicitud.motivacion}</p>
                  </div>

                  <div className="solicitud-actions">
                    <button 
                      className="btn-aprobar"
                      onClick={() => manejarSolicitudEscritor(solicitud.id, true)}
                    >
                      ✅ Aprobar como Escritor
                    </button>
                    <button 
                      className="btn-rechazar"
                      onClick={() => manejarSolicitudEscritor(solicitud.id, false)}
                    >
                      ❌ Rechazar Solicitud
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB: Noticias Pendientes */}
        {activeTab === 'noticias' && (
          <div className="noticias-list">
            {loading ? (
              <div className="loading">Cargando noticias...</div>
            ) : noticiasPendientes.length === 0 ? (
              <div className="empty-state">
                <p>✅ No hay noticias pendientes de revisión</p>
              </div>
            ) : (
              noticiasPendientes.map(noticia => (
                <div key={noticia.id} className="noticia-card">
                  <div className="noticia-header">
                    <h3>{noticia.title}</h3>
                    <span className="noticia-author">Por: {noticia.authorName}</span>
                  </div>
                  
                  <div className="noticia-meta">
                    <span className="category">🏷️ {noticia.category}</span>
                    <span className="date">
                      📅 {new Date(noticia.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Imagen de la noticia */}
                  {noticia.imageUrl && (
                    <div className="noticia-image">
                      <img src={noticia.imageUrl} alt={noticia.title} />
                    </div>
                  )}

                  <div className="noticia-content">
                    <p>{noticia.content}</p>
                  </div>

                  <div className="noticia-actions">
                    <button 
                      className="btn-aprobar"
                      onClick={() => manejarNoticia(noticia.id, true)}
                    >
                      ✅ Aprobar Noticia
                    </button>
                    
                    <div className="rechazo-section">
                      <textarea
                        placeholder="Retroalimentación para el escritor (opcional)"
                        value={feedbackByPost[noticia.id] || ''}
                        onChange={(e) => handleFeedbackChange(noticia.id, e.target.value)}
                        rows={3}
                      />
                      <button
                        className="btn-rechazar"
                        onClick={() => manejarNoticia(noticia.id, false)}
                      >
                        ❌ Rechazar con Retroalimentación
                      </button>
                    </div>

                    <div className="eliminar-section">
                      <input
                        type="text"
                        placeholder="Razón para eliminar la noticia"
                        className="delete-reason-input"
                        value={deleteReasons[noticia.id] || ''}
                        onChange={(e) => handleDeleteReasonChange(noticia.id, e.target.value)}
                      />
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarNoticia(noticia.id, deleteReasons[noticia.id] || '')}
                      >
                        🗑️ Eliminar Noticia
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB: Gestión de Usuarios */}
        {activeTab === 'usuarios' && (
          <div className="usuarios-list">
            {loading ? (
              <div className="loading">Cargando usuarios...</div>
            ) : usuarios.length === 0 ? (
              <div className="empty-state">No hay usuarios registrados</div>
            ) : (
              <div className="usuarios-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(usuario => (
                      <tr key={usuario.id}>
                        <td>{usuario.name}</td>
                        <td>{usuario.email}</td>
                        <td>
                          <span className={`role-badge ${usuario.role?.toLowerCase()}`}>
                            {usuario.role}
                          </span>
                        </td>
                        <td>
                          {new Date(usuario.createdAt).toLocaleDateString()}
                        </td>
                        <td className="user-actions">
                          {usuario.role === 'READER' && (
                            <button 
                              className="btn-promote"
                              onClick={() => actualizarRolUsuario(usuario.id, 'WRITER')}
                            >
                              ➕ Hacer Escritor
                            </button>
                          )}
                          {usuario.role === 'WRITER' && (
                            <button 
                              className="btn-demote"
                              onClick={() => actualizarRolUsuario(usuario.id, 'READER')}
                            >
                              ➖ Quitar Escritor
                            </button>
                          )}
                          <button 
                            className="btn-ban"
                            onClick={() => manejarUsuario(usuario.id, 'BAN')}
                          >
                            🔨 Suspender
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelAdmin;