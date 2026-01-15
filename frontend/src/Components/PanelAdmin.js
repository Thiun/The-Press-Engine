import React, { useState, useEffect } from 'react';
import './PanelAdmin.css';

/**
 * PanelAdmin
 *
 * Panel de administración para usuarios con rol ADMIN. Permite revisar y
 * gestionar solicitudes de escritores, noticias pendientes, usuarios,
 * publicidades y comentarios. Cada sección se presenta en su propia pestaña.
 *
 * Props:
 *  - user (Object): Objeto de usuario autenticado con propiedades id y name.
 */
function PanelAdmin({ user }) {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [solicitudesEscritores, setSolicitudesEscritores] = useState([]);
  const [noticiasPendientes, setNoticiasPendientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ads, setAds] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackByPost, setFeedbackByPost] = useState({});
  const [deleteReasons, setDeleteReasons] = useState({});
  const [adReasons, setAdReasons] = useState({});

  // Helpers para fechas
  const parseFecha = (valor) => {
    if (!valor) return null;
    if (Array.isArray(valor)) {
      const [year, month = 1, day = 1, hour = 0, minute = 0, second = 0] = valor;
      return new Date(year, month - 1, day, hour, minute, second);
    }
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime()) && typeof valor === 'number') {
      return new Date(valor);
    }
    return Number.isNaN(fecha.getTime()) ? null : fecha;
  };
  const formatearFecha = (valor) => {
    const fecha = parseFecha(valor);
    if (!fecha) return 'Sin registro';
    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Cargar datos según la pestaña activa
  useEffect(() => {
    switch (activeTab) {
      case 'solicitudes':
        fetchSolicitudesEscritores();
        break;
      case 'noticias':
        fetchNoticiasPendientes();
        break;
      case 'usuarios':
        fetchUsuarios();
        break;
      case 'publicidades':
        fetchAds();
        break;
      case 'comentarios':
        fetchComments();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // Cargar publicidades
  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/advertisements');
      if (response.ok) {
        const data = await response.json();
        setAds(Array.isArray(data) ? data : []);
        setAdReasons({});
      }
    } catch (error) {
      console.error('Error cargando publicidades:', error);
    } finally {
      setLoading(false);
    }
  };
  // Cargar comentarios
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/comments');
      if (response.ok) {
        const data = await response.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar aprobación/rechazo de solicitudes de escritores
  const manejarSolicitudEscritor = async (solicitud, aprobado) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/solicitudes/${solicitud.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: aprobado ? 'APROBADA' : 'RECHAZADA' }),
        }
      );
      if (response.ok) {
        // Actualizar rol del usuario si es aprobado
        if (aprobado) {
          await actualizarRolUsuario(solicitud.userId, 'WRITER', { silent: true });
        }
        fetchSolicitudesEscritores();
        alert(`Solicitud ${aprobado ? 'aprobada' : 'rechazada'} correctamente`);
      }
    } catch (error) {
      console.error('Error actualizando solicitud:', error);
    }
  };
  // Actualizar rol de usuario
  const actualizarRolUsuario = async (userId, nuevoRol, { silent = false } = {}) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/role`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: nuevoRol }),
        }
      );
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'No se pudo actualizar el rol del usuario');
      }
      await fetchUsuarios();
      if (!silent) {
        const mensaje =
          nuevoRol === 'WRITER'
            ? 'El usuario ahora es escritor.'
            : 'El usuario volvió a ser lector.';
        alert(mensaje);
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      if (!silent) {
        alert(error.message);
      }
      return false;
    }
  };
  // Manejar aprobación/rechazo de noticias
  const manejarNoticia = async (noticiaId, aprobado) => {
    try {
      const feedbackValue = feedbackByPost[noticiaId] || '';
      const response = await fetch(
        `http://localhost:8080/api/posts/${noticiaId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: aprobado ? 'APPROVED' : 'REJECTED',
            feedback: aprobado ? null : feedbackValue || null,
          }),
        }
      );
      if (response.ok) {
        fetchNoticiasPendientes();
        alert(`Noticia ${aprobado ? 'aprobada' : 'rechazada'} correctamente`);
        setFeedbackByPost((prev) => ({ ...prev, [noticiaId]: '' }));
      }
    } catch (error) {
      console.error('Error actualizando noticia:', error);
    }
  };
  const handleFeedbackChange = (postId, value) => {
    setFeedbackByPost((prev) => ({ ...prev, [postId]: value }));
  };
  const handleDeleteReasonChange = (postId, value) => {
    setDeleteReasons((prev) => ({ ...prev, [postId]: value }));
  };
  // Eliminar noticia
  const eliminarNoticia = async (noticiaId, razon) => {
    if (!razon.trim()) {
      alert('Por favor, proporciona una razón para la eliminación');
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/posts/${noticiaId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'REJECTED', deleteReason: razon }),
        }
      );
      if (response.ok) {
        fetchNoticiasPendientes();
        alert('Noticia eliminada correctamente');
        setDeleteReasons((prev) => ({ ...prev, [noticiaId]: '' }));
      }
    } catch (error) {
      console.error('Error eliminando noticia:', error);
    }
  };
  // Manejar usuarios
  const manejarUsuario = async (userId, accion, mensajeExito) => {
    if (userId === user?.id) {
      alert('No puedes modificar tu propio estado.');
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accion }),
        }
      );
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'No se pudo actualizar el estado del usuario');
      }
      await fetchUsuarios();
      alert(mensajeExito || 'Usuario actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      alert(error.message || 'Ocurrió un error al actualizar el usuario');
    }
  };
  const manejarEstadoUsuario = (usuario) => {
    if (usuario.status === 'BANNED') {
      manejarUsuario(usuario.id, 'UNBAN', 'La suspensión del usuario fue removida correctamente.');
      return;
    }
    const estaEliminado = usuario.status === 'DELETED';
    const accion = estaEliminado ? 'UNBAN' : 'DELETE';
    const mensaje = estaEliminado ? 'El usuario fue restaurado correctamente.' : 'El usuario fue eliminado correctamente.';
    manejarUsuario(usuario.id, accion, mensaje);
  };
  // Solicitudes pendientes
  const solicitudesPendientes = solicitudesEscritores.filter(
    (solicitud) => solicitud.estado === 'pendiente'
  );

  // Manejar publicidades (aprobar/rechazar)
  const manejarPublicidad = async (adId, aprobado) => {
    const reason = adReasons[adId] || '';
    try {
      const response = await fetch(
        `http://localhost:8080/api/advertisements/${adId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: aprobado ? 'APPROVED' : 'REJECTED',
            rejectionReason: aprobado ? null : reason || null,
          }),
        }
      );
      if (response.ok) {
        fetchAds();
        alert(`Publicidad ${aprobado ? 'aprobada' : 'rechazada'} correctamente`);
        setAdReasons((prev) => ({ ...prev, [adId]: '' }));
      }
    } catch (error) {
      console.error('Error actualizando publicidad:', error);
    }
  };
  const handleAdReasonChange = (adId, value) => {
    setAdReasons((prev) => ({ ...prev, [adId]: value }));
  };
  const eliminarPublicidad = async (adId) => {
    if (!window.confirm('¿Deseas eliminar esta publicidad?')) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/advertisements/${adId}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        fetchAds();
        alert('Publicidad eliminada');
      } else {
        const text = await response.text();
        alert(text || 'No se pudo eliminar la publicidad');
      }
    } catch (error) {
      console.error('Error eliminando publicidad:', error);
    }
  };
  // Manejar comentarios (eliminar)
  const eliminarComentario = async (commentId) => {
    if (!window.confirm('¿Deseas eliminar este comentario?')) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/${commentId}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        fetchComments();
        alert('Comentario eliminado');
      } else {
        const text = await response.text();
        alert(text || 'No se pudo eliminar el comentario');
      }
    } catch (error) {
      console.error('Error eliminando comentario:', error);
    }
  };

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
        <button
          className={`tab ${activeTab === 'publicidades' ? 'active' : ''}`}
          onClick={() => setActiveTab('publicidades')}
        >
          📣 Publicidades ({ads.length})
        </button>
        <button
          className={`tab ${activeTab === 'comentarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('comentarios')}
        >
          💬 Comentarios ({comments.length})
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
              solicitudesPendientes.map((solicitud) => (
                <div key={solicitud.id} className="solicitud-card">
                  <div className="solicitud-header">
                    <h3>{solicitud.userName}</h3>
                    <span className="solicitud-email">{solicitud.userEmail}</span>
                  </div>
                  <div className="solicitud-meta">
                    <span className="fecha">
                      📅{' '}
                      {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="solicitud-motivo">
                    <strong>Motivo:</strong>
                    <p>{solicitud.motivo}</p>
                  </div>
                  <div className="solicitud-actions">
                    <button
                      className="btn-aprobar"
                      onClick={() => manejarSolicitudEscritor(solicitud, true)}
                    >
                      ✅ Aprobar como Escritor
                    </button>
                    <button
                      className="btn-rechazar"
                      onClick={() => manejarSolicitudEscritor(solicitud, false)}
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
              noticiasPendientes.map((noticia) => (
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
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.name}</td>
                        <td>{usuario.email}</td>
                        <td>
                          <span className={`role-badge ${usuario.role?.toLowerCase()}`}>
                            {usuario.role}
                          </span>
                        </td>
                        <td>{formatearFecha(usuario.createdAt)}</td>
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
                            disabled={usuario.id === user?.id}
                            onClick={() => manejarEstadoUsuario(usuario)}
                            title={
                              usuario.id === user?.id
                                ? 'No puedes modificar tu propia cuenta'
                                : ''
                            }
                          >
                            {usuario.id === user?.id
                              ? 'No disponible'
                              : usuario.status === 'BANNED'
                              ? '✅ Quitar Suspensión'
                              : usuario.status === 'DELETED'
                              ? '♻️ Restaurar Usuario'
                              : '🗑️ Eliminar Usuario'}
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
        {/* TAB: Publicidades */}
        {activeTab === 'publicidades' && (
          <div className="ads-admin-list">
            {loading ? (
              <div className="loading">Cargando publicidades...</div>
            ) : ads.length === 0 ? (
              <div className="empty-state">
                No hay publicidades registradas
              </div>
            ) : (
              ads.map((ad) => (
                <div key={ad.id} className="ad-admin-card">
                  <div className="ad-admin-header">
                    <h3>{ad.brand}</h3>
                    <span className={`ad-status ${ad.status.toLowerCase()}`}>
                      {ad.status}
                    </span>
                  </div>
                  <p>
                    <strong>Usuario:</strong> {ad.userName}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {ad.description}
                  </p>
                  {ad.imageUrl && (
                    <div className="ad-admin-image">
                      <img
                        src={ad.imageUrl}
                        alt={`Imagen de publicidad para ${ad.brand}`}
                      />
                    </div>
                  )}
                  <p>
                    <strong>Duración:</strong> {ad.durationDays} días
                  </p>
                  {ad.paid && ad.startDate && ad.endDate && (
                    <p>
                      <strong>Pago:</strong> Realizado
                      <br />
                      <strong>Inicio:</strong>{' '}
                      {new Date(ad.startDate).toLocaleDateString()}
                      <br />
                      <strong>Fin:</strong>{' '}
                      {new Date(ad.endDate).toLocaleDateString()}
                    </p>
                  )}
                  {ad.status === 'REJECTED' && ad.rejectionReason && (
                    <p>
                      <strong>Razón rechazo:</strong> {ad.rejectionReason}
                    </p>
                  )}
                  <div className="ad-admin-actions">
                    {ad.status === 'PENDING' && (
                      <>
                        <textarea
                          placeholder="Razón de rechazo (opcional)"
                          value={adReasons[ad.id] || ''}
                          onChange={(e) => handleAdReasonChange(ad.id, e.target.value)}
                          rows={2}
                        />
                        <button
                          className="btn-aprobar"
                          onClick={() => manejarPublicidad(ad.id, true)}
                        >
                          ✅ Aprobar
                        </button>
                        <button
                          className="btn-rechazar"
                          onClick={() => manejarPublicidad(ad.id, false)}
                        >
                          ❌ Rechazar
                        </button>
                      </>
                    )}
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarPublicidad(ad.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {/* TAB: Comentarios */}
        {activeTab === 'comentarios' && (
          <div className="comments-admin-list">
            {loading ? (
              <div className="loading">Cargando comentarios...</div>
            ) : comments.length === 0 ? (
              <div className="empty-state">No hay comentarios registrados</div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-admin-card">
                  <p>
                    <strong>{comment.userName}</strong> en noticia {comment.postId}
                    <br />
                    <small>{new Date(comment.createdAt).toLocaleString('es-ES')}</small>
                  </p>
                    <p>{comment.content}</p>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarComentario(comment.id)}
                    >
                      🗑️ Eliminar
                    </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelAdmin;
