import React, { useEffect, useState } from 'react';
import CommentsSection from './CommentsSection';
import './NewsFeed.css';

/**
 * NewsFeed
 *
 * Este componente carga las noticias publicadas desde el backend y las muestra
 * en una lista. Para cada noticia, si el usuario está autenticado, se
 * renderiza un componente CommentsSection que permite ver y agregar
 * comentarios a la noticia. Se manejan estados de carga y error para
 * proporcionar retroalimentación al usuario.
 *
 * Props:
 *  - user (Object|null): usuario autenticado. Se pasa a CommentsSection.
 */
function NewsFeed({ user }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8080/api/posts/publicadas');
        if (!response.ok) {
          throw new Error('No se pudieron cargar las noticias publicadas.');
        }
        const data = await response.json();
        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return <div className="newsfeed-loading">Cargando noticias...</div>;
  }
  if (error) {
    return <div className="newsfeed-error">{error}</div>;
  }
  if (!news.length) {
    return <div className="newsfeed-empty">Aún no hay noticias publicadas.</div>;
  }
  return (
    <section className="newsfeed">
      {news.map((item) => (
        <article key={item.id} className="news-card">
          {item.imageUrl && (
            <div className="news-card-image">
              <img src={item.imageUrl} alt={item.title} />
            </div>
          )}
          <div className="news-card-content">
            <h2 className="news-card-title">{item.title}</h2>
            <div className="news-card-meta">
              <span>{item.authorName}</span>
              {item.category && (
                <span className="news-card-category">{item.category}</span>
              )}
              <span>{new Date(item.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <p className="news-card-body">{item.content}</p>
            {/* Renderizar sección de comentarios para cada noticia */}
            <CommentsSection postId={item.id} user={user} />
          </div>
        </article>
      ))}
    </section>
  );
}

export default NewsFeed;