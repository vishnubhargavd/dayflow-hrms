import { useState, useEffect } from 'react';
import { HealthProvider } from './context/HealthContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LandingPage } from './pages/LandingPage';
import { AuthenticatedAppShell } from './layouts/AuthenticatedAppShell';
import { EntryExperience } from './components/entry/EntryExperience';
import { LoginModal } from './components/auth/LoginModal';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('app');
    }
  }, [isAuthenticated]);

  const handleNavigateToApp = () => {
    if (isAuthenticated) {
      setCurrentView('app');
    } else {
      setShowLoginModal(true);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060806', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F3F1E8' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #7CFFB2', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: '#8A918A', letterSpacing: '0.1em' }}>
            INITIALIZING SESSION...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {currentView === 'app' && isAuthenticated ? (
        <AuthenticatedAppShell onBackToLanding={() => setCurrentView('landing')} />
      ) : (
        <LandingPage onNavigateToDashboard={handleNavigateToApp} />
      )}

      {showIntro && !isAuthenticated && (
        <EntryExperience onComplete={() => setShowIntro(false)} />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          setCurrentView('app');
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <HealthProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </HealthProvider>
    </ToastProvider>
  );
}

export default App;
