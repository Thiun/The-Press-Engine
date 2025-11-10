import { useEffect, useState } from 'react';
import HeaderNoLog from './Components/HeaderNoLog';
import HeaderLogLector from './Components/HeaderLogLector';
import HeaderLogWriter from './Components/HeaderLogWriter';
import HeaderLogAdmin from './Components/HeaderLogAdmin';
import NewsFeed from './Components/NewsFeed';
import './App.css';

function App() {
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem('tpe-session');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('No se pudo parsear la sesión almacenada', error);
      return null;
    }
  });
  useEffect(() => {
    if (session) {
      localStorage.setItem('tpe-session', JSON.stringify(session));
    } else {
      localStorage.removeItem('tpe-session');
    }
  }, [session]);

  const handleLogin = (loginPayload) => {
    setSession(loginPayload);
  };

  const handleLogout = () => {
    setSession(null);
  };

  const handleSolicitudTrabajo = async (solicitud) => {
    try {
      const response = await fetch('http://localhost:8080/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitud),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'No se pudo registrar la solicitud');
      }

      alert('✅ ¡Solicitud enviada! Te notificaremos cuando sea revisada.');
    } catch (error) {
      alert(error.message);
    }
  };

  const getHeaderForRole = () => {
    if (!session) {
      return (
        <HeaderNoLog
          onLoginSuccess={handleLogin}
        />
      );
    }

    const currentUser = { ...session.user, token: session.token };

    switch (session.user.role) {
      case 'ADMIN':
        return (
          <HeaderLogAdmin
            user={currentUser}
            onLogout={handleLogout}
          />
        );
      case 'WRITER':
        return (
          <HeaderLogWriter
            user={currentUser}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <HeaderLogLector
            user={currentUser}
            onLogout={handleLogout}
            onSolicitudTrabajo={handleSolicitudTrabajo}
          />
        );
    }
  };

  return (
    <div className="App">
      {getHeaderForRole()}
      <main className="app-content">
        <NewsFeed />
      </main>
    </div>
  );
}

export default App;
