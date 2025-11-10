import React, { useEffect, useState } from 'react';
import './NewsFeed.css';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return '';
  }
};

function NewsFeed() {
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
              {item.category && <span className="news-card-category">{item.category}</span>}
              <span>{formatDate(item.createdAt)}</span>
            </div>
            <p className="news-card-body">{item.content}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

export default NewsFeed;
