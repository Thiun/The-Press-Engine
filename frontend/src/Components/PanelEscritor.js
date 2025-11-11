import React, { useState, useEffect, useCallback } from 'react';
import './PanelEscritor.css';

function PanelEscritor({ user }) {
  const [activeTab, setActiveTab] = useState('crear');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Estados para nuevo post
  const [nuevoPost, setNuevoPost] = useState({
    title: '',
    content: '',
    category: '',
    image: null,
    imagePreview: ''
  });

  // Cargar posts del escritor
  const fetchPosts = useCallback(async () => {
    const userId = user?.id;
    if (!userId) {
      setPosts([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/posts/escritor/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error cargando posts:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Manejar selección de imagen
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona solo archivos de imagen');
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setNuevoPost(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Subir imagen al servidor
  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        throw new Error('Error al subir imagen');
      }
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    }
  };

  // Eliminar imagen seleccionada
  const removeImage = () => {
    setNuevoPost(prev => ({
      ...prev,
      image: null,
      imagePreview: ''
    }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!nuevoPost.title || !nuevoPost.content || !nuevoPost.category) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    setUploadingImage(true);

    try {
      let imageUrl = '';
      
      // Subir imagen si hay una seleccionada
      if (nuevoPost.image) {
        imageUrl = await uploadImage(nuevoPost.image);
      }

      // Crear el post
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: nuevoPost.title,
          content: nuevoPost.content,
          category: nuevoPost.category,
          authorId: user.id,
          authorName: user.name,
          imageUrl: imageUrl
        })
      });

      if (response.ok) {
        alert('✅ Noticia enviada para revisión');
        setNuevoPost({ 
          title: '', 
          content: '', 
          category: '',
          image: null,
          imagePreview: ''
        });
        fetchPosts(); // Recargar lista
        setActiveTab('mis-noticias');
      } else {
        alert('Error al enviar la noticia');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la noticia');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPostsByStatus = (status) => {
    return posts.filter(post => post.status === status);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { class: 'pending', text: '⏳ Pendiente' },
      'APPROVED': { class: 'approved', text: '✅ Aprobada' },
      'REJECTED': { class: 'rejected', text: '❌ Rechazada' }
    };
    
    const config = statusConfig[status] || { class: 'pending', text: status };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  return (
    <div className="panel-escritor">
      <h2>✍️ Panel del Escritor</h2>
      
      {/* Tabs de navegación */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'crear' ? 'active' : ''}`}
          onClick={() => setActiveTab('crear')}
        >
          📝 Crear Noticia
        </button>
        <button 
          className={`tab ${activeTab === 'mis-noticias' ? 'active' : ''}`}
          onClick={() => setActiveTab('mis-noticias')}
        >
          📋 Mis Noticias ({posts.length})
        </button>
        <button 
          className={`tab ${activeTab === 'pendientes' ? 'active' : ''}`}
          onClick={() => setActiveTab('pendientes')}
        >
          ⏳ Pendientes ({getPostsByStatus('PENDING').length})
        </button>
        <button 
          className={`tab ${activeTab === 'rechazadas' ? 'active' : ''}`}
          onClick={() => setActiveTab('rechazadas')}
        >
          ❌ Rechazadas ({getPostsByStatus('REJECTED').length})
        </button>
      </div>

      {/* Contenido de las tabs */}
      <div className="tab-content">
        
        {/* TAB: Crear Noticia */}
        {activeTab === 'crear' && (
          <form onSubmit={handleCreatePost} className="post-form">
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                name="title"
                value={nuevoPost.title}
                onChange={handleInputChange}
                placeholder="Título de la noticia"
                required
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select
                name="category"
                value={nuevoPost.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="POLITICA">Política</option>
                <option value="DEPORTES">Deportes</option>
                <option value="TECNOLOGIA">Tecnología</option>
                <option value="ENTRETENIMIENTO">Entretenimiento</option>
                <option value="ECONOMIA">Economía</option>
                <option value="SALUD">Salud</option>
                <option value="INTERNACIONAL">Internacional</option>
              </select>
            </div>

            {/* Sección de Imagen */}
            <div className="form-group">
              <label>Imagen de la noticia (Opcional)</label>
              
              {nuevoPost.imagePreview ? (
                <div className="image-preview-container">
                  <div className="image-preview">
                    <img src={nuevoPost.imagePreview} alt="Vista previa" />
                    <button 
                      type="button" 
                      className="btn-remove-image"
                      onClick={removeImage}
                    >
                      ✕
                    </button>
                  </div>
                  <span className="image-name">{nuevoPost.image.name}</span>
                </div>
              ) : (
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="image-input"
                  />
                  <label htmlFor="image-upload" className="image-upload-label">
                    <div className="upload-icon">📷</div>
                    <span>Haz clic para seleccionar una imagen</span>
                    <small>Formatos: JPG, PNG, GIF (Máx. 5MB)</small>
                  </label>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Contenido *</label>
              <textarea
                name="content"
                value={nuevoPost.content}
                onChange={handleInputChange}
                placeholder="Escribe el contenido de la noticia aquí..."
                required
                rows={8}
                maxLength={5000}
              />
              <div className="char-count">{nuevoPost.content.length}/5000</div>
            </div>

            <button 
              type="submit" 
              className="btn-submit-post"
              disabled={uploadingImage}
            >
              {uploadingImage ? '📤 Subiendo imagen...' : '📤 Enviar para Revisión'}
            </button>
          </form>
        )}

        {/* TAB: Mis Noticias */}
        {activeTab === 'mis-noticias' && (
          <div className="posts-list">
            {loading ? (
              <div className="loading">Cargando noticias...</div>
            ) : posts.length === 0 ? (
              <div className="empty-state">
                <p>📭 Aún no has creado ninguna noticia</p>
                <button 
                  className="btn-create-first"
                  onClick={() => setActiveTab('crear')}
                >
                  Crear mi primera noticia
                </button>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <h3>{post.title}</h3>
                    {getStatusBadge(post.status)}
                  </div>
                  
                  <div className="post-meta">
                    <span className="category">🏷️ {post.category}</span>
                    <span className="date">
                      📅 {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Mostrar imagen si existe */}
                  {post.imageUrl && (
                    <div className="post-image">
                      <img src={post.imageUrl} alt={post.title} />
                    </div>
                  )}

                  <p className="post-content-preview">
                    {post.content.substring(0, 150)}...
                  </p>

                  {/* Mostrar retroalimentación si fue rechazada */}
                  {post.status === 'REJECTED' && post.feedback && (
                    <div className="feedback-section">
                      <strong>📝 Retroalimentación del administrador:</strong>
                      <p className="feedback-text">{post.feedback}</p>
                      <div className="feedback-actions">
                        <button className="btn-edit">
                          ✏️ Editar y Reenviar
                        </button>
                        <button className="btn-delete">
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mostrar si fue rechazada con motivo de eliminación */}
                  {post.status === 'REJECTED' && post.deleteReason && (
                    <div className="delete-section">
                      <strong>🗑️ Noticia eliminada - Razón:</strong>
                      <p className="delete-reason">{post.deleteReason}</p>
                      <div className="checkbox-container">
                        <label>
                          <input type="checkbox" />
                          He entendido la razón de la eliminación
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Otras tabs permanecen igual */}
        {activeTab === 'pendientes' && (
          <div className="posts-list">
            {getPostsByStatus('PENDING').length === 0 ? (
              <div className="empty-state">
                <p>✅ No tienes noticias pendientes de revisión</p>
              </div>
            ) : (
              getPostsByStatus('PENDING').map(post => (
                <div key={post.id} className="post-card pending-card">
                  <h3>{post.title}</h3>
                  <div className="post-meta">
                    <span className="category">🏷️ {post.category}</span>
                    <span className="date">
                      Enviada: {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {post.imageUrl && (
                    <div className="post-image-small">
                      <img src={post.imageUrl} alt={post.title} />
                    </div>
                  )}
                  
                  <p>⏳ Esperando revisión del administrador...</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'rechazadas' && (
          <div className="posts-list">
            {getPostsByStatus('REJECTED').length === 0 ? (
              <div className="empty-state">
                <p>🎉 No tienes noticias rechazadas</p>
              </div>
            ) : (
              getPostsByStatus('REJECTED').map(post => (
                <div key={post.id} className="post-card rejected-card">
                  <div className="post-header">
                    <h3>{post.title}</h3>
                    {getStatusBadge(post.status)}
                  </div>
                  
                  {post.imageUrl && (
                    <div className="post-image-small">
                      <img src={post.imageUrl} alt={post.title} />
                    </div>
                  )}
                  
                  {post.feedback && (
                    <div className="feedback-section">
                      <strong>📝 Para mejorar:</strong>
                      <p className="feedback-text">{post.feedback}</p>
                      <button className="btn-edit-full">
                        ✏️ Editar con la retroalimentación
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelEscritor;