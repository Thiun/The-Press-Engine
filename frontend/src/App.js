import { useEffect, useState } from 'react';
import HeaderNoLog from './Components/HeaderNoLog';
import HeaderLogLector from './Components/HeaderLogLector';
import HeaderLogWriter from './Components/HeaderLogWriter';
import HeaderLogAdmin from './Components/HeaderLogAdmin';
import NewsFeed from './Components/NewsFeed';
import './App.css';

/**
 * Main application component responsible for choosing the correct header based
 * on the authenticated user's role and rendering the news feed. The user
 * session is persisted in localStorage under the key `tpe-session`.
 */
function App() {
  // Load session from localStorage on first render
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
  // Selected section is fixed to 'noticias' for now; could expand later
  const [selectedSection] = useState('noticias');

  // Keep localStorage in sync with session state
  useEffect(() => {
    if (session) {
      localStorage.setItem('tpe-session', JSON.stringify(session));
    } else {
      localStorage.removeItem('tpe-session');
    }
  }, [session]);

  /**
   * Handle successful login from the Login component. Stores the returned
   * session (containing user information and token) into state.
   *
   * @param {Object} loginPayload Session data returned from backend
   */
  const handleLogin = (loginPayload) => {
    setSession(loginPayload);
  };

  /**
   * Clear the current session on logout.
   */
  const handleLogout = () => {
    setSession(null);
  };

  /**
   * Submit a writer request on behalf of a reader. This is passed down
   * to the HeaderLogLector component and executed when the reader
   * completes the application form.
   *
   * @param {Object} solicitud The request payload with user id, name, email and motivo
   */
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

  /**
   * Determine which header to display based on the current user's role.
   * For unauthenticated users, show the login/register header. The
   * appropriate header passes down event handlers for login and logout.
   */
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
        {/* Always render the news feed. Pass the current user down so
            comments and other user‑specific features can be shown */}
        {selectedSection === 'noticias' ? <NewsFeed user={session?.user ?? null} /> : null}
      </main>
    </div>
  );
}

export default App;