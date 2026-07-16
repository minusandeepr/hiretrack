/**
 * App.jsx
 * ---------------------------------------------------------------------------
 * Root component for HireTrack ATS.
 *
 * Responsibilities:
 *   – Wraps the component tree with context providers (AuthProvider).
 *   – Renders the application router (AppRoutes).
 */

import { AuthProvider } from './context/AuthContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;

