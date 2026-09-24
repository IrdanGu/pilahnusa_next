import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ToastProvider } from './components/ui/Toast';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import GuidePage from './pages/GuidePage';
import TeamPage from './pages/TeamPage';
import ChatbotPage from './pages/ChatbotPage';
import WasteBankPage from './pages/WasteBankPage';
import ErrorBoundary from './components/ErrorBoundary';
import { getOrCreateUserId } from './utils/userUtils';

/**
 * Root application component with routing and toast context
 */
function App() {
  // Initialize unique user ID on first access
  useEffect(() => {
    getOrCreateUserId();
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          {/* Skip to main content — accessibility */}
          <a href="#main-content" className="skip-link">
            Lewati ke konten utama
          </a>

          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/result/:id" element={<ResultPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/bank-sampah" element={<WasteBankPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/team" element={<TeamPage />} />
            </Routes>
          </Layout>

        <style>{`
          .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--color-primary);
            color: white;
            padding: 8px 16px;
            border-radius: 0 0 var(--radius-md) 0;
            z-index: 10000;
            font-weight: 600;
            font-family: var(--font-body);
            font-size: 0.875rem;
            text-decoration: none;
            transition: top var(--transition-fast);
          }

          .skip-link:focus {
            top: 0;
          }
        `}</style>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
