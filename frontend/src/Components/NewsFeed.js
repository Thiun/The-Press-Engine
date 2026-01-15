import React, { useEffect, useMemo, useState } from 'react';
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
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const [newsResponse, adsResponse] = await Promise.all([
          fetch('http://localhost:8080/api/posts/publicadas'),
          fetch('http://localhost:8080/api/advertisements'),
        ]);

        if (!newsResponse.ok) {
          throw new Error('No se pudieron cargar las noticias publicadas.');
        }

        const newsData = await newsResponse.json();
        setNews(Array.isArray(newsData) ? newsData : []);

        if (adsResponse.ok) {
          const adsData = await adsResponse.json();
          setAds(Array.isArray(adsData) ? adsData : []);
        } else {
          setAds([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const sidebarAds = useMemo(() => {
    const approvedAds = ads.filter((ad) => ad.status === 'APPROVED');
    if (!approvedAds.length) {
      return [];
    }

    const shuffledAds = [...approvedAds];
    for (let i = shuffledAds.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledAds[i], shuffledAds[j]] = [shuffledAds[j], shuffledAds[i]];
    }

    return shuffledAds;
  }, [ads]);

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
    <section className="newsfeed-layout">
      <div className="newsfeed-main">
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
                <span>
                  {new Date(item.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="news-card-body">{item.content}</p>
              {/* Renderizar sección de comentarios para cada noticia */}
              <CommentsSection postId={item.id} user={user} />
            </div>
          </article>
        ))}
      </div>
      {sidebarAds.length > 0 && (
        <aside className="newsfeed-sidebar">
          <div className="newsfeed-sidebar-header">Publicidad</div>
          <div className="newsfeed-sidebar-list">
            {sidebarAds.map((ad) => (
              <article key={ad.id} className="news-ad-card">
                <div className="news-ad-label">Sponsor</div>
                {ad.imageUrl && (
                  <div className="news-ad-image">
                    <img src={ad.imageUrl} alt={ad.brand} />
                  </div>
                )}
                <div className="news-ad-content">
                  <h3>{ad.brand}</h3>
                  <p>{ad.description}</p>
                  <div className="news-ad-meta">
                    <span>{ad.durationDays} días</span>
                    <span>{ad.userName}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>
      )}
    </section>
  );
}

export default NewsFeed;
