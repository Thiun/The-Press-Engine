import React, { useEffect, useState } from 'react';
import './CommentsSection.css';

/**
 * CommentsSection
 *
 * Muestra comentarios asociados a una noticia y permite agregar uno nuevo
 * si el usuario está autenticado. En caso de error, se muestra un mensaje
 * de estado para evitar romper el feed.
 *
 * Props:
 *  - postId (string): ID de la noticia.
 *  - user (Object|null): usuario autenticado.
 */
function CommentsSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!postId) return;
    const fetchComments = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:8080/api/comments?postId=${postId}`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar los comentarios.');
        }
        const data = await response.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Comentarios no disponibles.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Inicia sesión para comentar.');
      return;
    }
    if (!newComment.trim()) {
      setError('El comentario no puede estar vacío.');
      return;
    }

    try {
      setError('');
      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          userId: user.id,
          userName: user.name || 'Usuario',
          content: newComment.trim(),
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'No se pudo guardar el comentario.');
      }

      const created = await response.json();
      setComments((prev) => [...prev, created]);
      setNewComment('');
    } catch (err) {
      setError(err.message || 'No se pudo guardar el comentario.');
    }
  };

  return (
    <div className="comments-section">
      <h3>💬 Comentarios</h3>
      {loading ? (
        <div className="comments-loading">Cargando comentarios...</div>
      ) : error ? (
        <div className="comments-error">{error}</div>
      ) : comments.length === 0 ? (
        <div className="comments-empty">Sé el primero en comentar.</div>
      ) : (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-meta">
                <strong>{comment.userName}</strong>
                <span>
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleString('es-ES')
                    : ''}
                </span>
              </div>
              <p>{comment.content}</p>
            </li>
          ))}
        </ul>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          placeholder={user ? 'Escribe un comentario...' : 'Inicia sesión para comentar'}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user}
          rows={3}
        />
        <button type="submit" disabled={!user || !newComment.trim()}>
          Enviar comentario
        </button>
      </form>
    </div>
  );
}

export default CommentsSection;
