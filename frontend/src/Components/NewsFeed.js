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

  const feedItems = useMemo(() => {
    const approvedAds = ads.filter((ad) => ad.status === 'APPROVED');
    if (!approvedAds.length) {
      return news.map((item) => ({ type: 'news', data: item }));
    }

    const shuffledAds = [...approvedAds];
    for (let i = shuffledAds.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledAds[i], shuffledAds[j]] = [shuffledAds[j], shuffledAds[i]];
    }

    const items = [];
    let adIndex = 0;
    news.forEach((item, index) => {
      items.push({ type: 'news', data: item, key: `news-${item.id}` });
      const shouldInsertAd = shuffledAds.length > 0 && Math.random() < 0.35;
      const hasMoreNews = index < news.length - 1;
      if (shouldInsertAd && hasMoreNews && adIndex < shuffledAds.length) {
        const ad = shuffledAds[adIndex];
        items.push({ type: 'ad', data: ad, key: `ad-${ad.id}-${index}` });
        adIndex += 1;
      }
    });

    return items;
  }, [ads, news]);

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
      {feedItems.map((item, index) => {
        if (item.type === 'ad') {
          return (
            <article
              key={item.key || `ad-${index}`}
              className="news-card news-ad-card"
            >
              <div className="news-ad-label">Publicidad</div>
              <div className="news-card-content">
                <h2 className="news-card-title">{item.data.brand}</h2>
                <p className="news-card-body">{item.data.description}</p>
                <div className="news-ad-meta">
                  <span>Duración: {item.data.durationDays} días</span>
                  <span>Por: {item.data.userName}</span>
                </div>
              </div>
            </article>
          );
        }

        return (
          <article key={item.data.id} className="news-card">
            {item.data.imageUrl && (
              <div className="news-card-image">
                <img src={item.data.imageUrl} alt={item.data.title} />
              </div>
            )}
            <div className="news-card-content">
              <h2 className="news-card-title">{item.data.title}</h2>
              <div className="news-card-meta">
                <span>{item.data.authorName}</span>
                {item.data.category && (
                  <span className="news-card-category">{item.data.category}</span>
                )}
                <span>
                  {new Date(item.data.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="news-card-body">{item.data.content}</p>
              {/* Renderizar sección de comentarios para cada noticia */}
              <CommentsSection postId={item.data.id} user={user} />
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default NewsFeed;
