import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ToastProvider } from './components/ui/Toast';
import { ThemeProvider } from './hooks/useTheme';
import ErrorBoundary from './components/ErrorBoundary';
import { SkeletonGrid } from './components/ui/Skeleton';
import { getOrCreateUserId } from './utils/userUtils';

const HomePage = lazy(() => import('./pages/HomePage'));
const ScanPage = lazy(() => import('./pages/ScanPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const ChatbotPage = lazy(() => import('./pages/ChatbotPage'));
const WasteBankPage = lazy(() => import('./pages/WasteBankPage'));
const ImpactPage = lazy(() => import('./pages/ImpactPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const ROUTE_TITLES = {
  '/': 'BilahBeu AI — Pemilah Sampah Cerdas & Daur Ulang',
  '/scan': 'Scan Sampah AI — BilahBeu AI',
  '/dampak': 'DampakKu — BilahBeu AI',
  '/tantangan': 'Eco Challenge — BilahBeu AI',
  '/bank-sampah': 'Bank Sampah — BilahBeu AI',
  '/chatbot': 'Chatbot BilahBeu — BilahBeu AI',
  '/guide': 'Panduan Pemilahan — BilahBeu AI',
  '/history': 'Riwayat Scan — BilahBeu AI',
};

function RouteTitleSync() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/result/')) {
      document.title = 'Hasil Klasifikasi — BilahBeu AI';
      return;
    }
    document.title = ROUTE_TITLES[pathname] || 'Halaman Tidak Ditemukan — BilahBeu AI';
  }, [pathname]);

  return null;
}

function RouteFallback() {
  return (
    <div style={{ padding: '32px 24px', maxWidth: '960px', margin: '0 auto' }} aria-busy="true">
      <SkeletonGrid count={3} />
    </div>
  );
}

/**
 * Root application component with theme, routing, code-splitting, and toast context
 */
function App() {
  useEffect(() => {
    getOrCreateUserId();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <RouteTitleSync />

            {/* Skip to main content — accessibility */}
            <a href="#main-content" className="skip-link">
              Lewati ke konten utama
            </a>

            <Layout>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/scan" element={<ScanPage />} />
                  <Route path="/result/:id" element={<ResultPage />} />
                  <Route path="/dampak" element={<ImpactPage />} />
                  <Route path="/tantangan" element={<QuizPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/chatbot" element={<ChatbotPage />} />
                  <Route path="/bank-sampah" element={<WasteBankPage />} />
                  <Route path="/guide" element={<GuidePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Layout>

            <style>{`
              .skip-link {
                position: absolute;
                top: -48px;
                left: 0;
                background: var(--color-primary-btn, #15803D);
                color: #FFFFFF;
                padding: 10px 18px;
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
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
