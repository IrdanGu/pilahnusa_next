import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  resetError = () => this.setState({ hasError: false, error: null });

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__card">
            <AlertCircle size={56} color="var(--color-warning)" aria-hidden="true" />
            <h1>Oops! Terjadi Kesalahan</h1>
            <p>
              Maaf, aplikasi mengalami masalah yang tidak terduga. Silakan muat ulang halaman ini.
            </p>
            <div className="error-boundary__actions">
              <button type="button" onClick={this.resetError}>Coba Lagi</button>
              <button type="button" onClick={() => { window.location.href = '/'; }}>Ke Beranda</button>
              <button type="button" onClick={() => window.location.reload()}>Muat Ulang</button>
            </div>
            {import.meta.env.DEV && (
              <div className="error-boundary__details">
                <pre>{this.state.error?.toString()}</pre>
              </div>
            )}
          </div>
          <style>{`
            .error-boundary { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: var(--color-bg); color: var(--color-text-primary); }
            .error-boundary__card { width: min(100%, 460px); padding: 40px 32px; text-align: center; background: var(--color-surface-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); }
            .error-boundary h1 { margin: 18px 0 8px; font-size: 1.5rem; }
            .error-boundary p { margin: 0 0 24px; }
            .error-boundary__actions { display: grid; gap: 10px; }
            .error-boundary__actions button { min-height: 44px; padding: 10px 16px; border-radius: var(--radius-md); background: var(--color-primary-btn); color: #fff; font: 700 0.9rem var(--font-body); }
            .error-boundary__actions button:hover { background: var(--color-primary-btn-hover); }
            .error-boundary__actions button:nth-child(2) { background: var(--color-primary-bg); color: var(--color-primary-btn); }
            .error-boundary__details { margin-top: 24px; padding: 12px; text-align: left; overflow: auto; background: var(--color-bg); border-radius: var(--radius-md); color: var(--color-warning); font-size: 0.75rem; }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
