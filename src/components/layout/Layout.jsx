import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  BookOpen,
  BotMessageSquare,
  Camera,
  Clock,
  Home,
  Leaf,
  MapPin,
  Menu,
  Moon,
  Sun,
  Trophy,
  X,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const MOBILE_MENU_ITEMS = [
  { path: '/', label: 'Beranda', icon: Home, exact: true },
  { path: '/scan', label: 'Scan AI', icon: Camera },
  { path: '/dampak', label: 'DampakKu', icon: Leaf },
  { path: '/tantangan', label: 'Eco Challenge', icon: Trophy },
  { path: '/bank-sampah', label: 'Bank Sampah', icon: MapPin },
  { path: '/chatbot', label: 'Chatbot', icon: BotMessageSquare },
  { path: '/guide', label: 'Panduan', icon: BookOpen },
  { path: '/history', label: 'Riwayat', icon: Clock },
];

const MobileHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header className="mobile-header">
        <Link to="/" className="mobile-header__brand" aria-label="BilahBeu AI, Beranda">
          <img src="/images/logo.png" alt="" />
          <span>BilahBeu <strong>AI</strong></span>
        </Link>

        <nav className="mobile-header__links" aria-label="Tautan cepat">
          <Link to="/tantangan">Tantangan</Link>
          <Link to="/guide">Panduan</Link>
          <Link to="/history">Riwayat</Link>
        </nav>

        <div className="mobile-header__controls">
          <button
            className="theme-toggle theme-toggle--mobile"
            type="button"
            onClick={toggleTheme}
            aria-label={`Aktifkan tema ${theme === 'dark' ? 'terang' : 'gelap'}`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="theme-toggle mobile-menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav id="mobile-nav-drawer" className="mobile-drawer" aria-label="Menu navigasi lengkap">
          {MOBILE_MENU_ITEMS.map(({ path, label, icon: Icon, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              className={({ isActive }) =>
                `mobile-drawer__link ${isActive ? 'mobile-drawer__link--active' : ''}`
              }
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
};

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="layout">
      <Sidebar />
      <MobileHeader />
      <main className="layout__main" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <BottomNav />
      <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg);
          position: relative;
        }

        .layout__main {
          flex: 1;
          min-width: 0;
          overflow-x: hidden;
        }

        .mobile-header,
        .mobile-drawer { display: none; }

        .theme-toggle {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 44px; min-height: 44px; border-radius: var(--radius-md);
          color: var(--color-text-secondary); background: var(--color-bg-secondary);
          transition: background var(--transition-fast), color var(--transition-fast);
        }
        .theme-toggle:hover { color: var(--color-primary-text); background: var(--color-primary-bg); }

        @media (max-width: 1023px) {
          .layout {
            flex-direction: column;
          }

          .layout__main {
            padding-bottom: 92px;
          }

          .mobile-header {
            display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 64px;
            padding: 8px 16px; background: var(--color-surface);
            border-bottom: 1px solid var(--color-border); position: sticky; top: 0; z-index: 90;
          }

          .mobile-header__brand {
            display: inline-flex; align-items: center; gap: 8px; min-height: 44px;
            color: var(--color-text-primary); font-family: var(--font-heading); font-weight: 800; white-space: nowrap;
          }
          .mobile-header__brand img { width: 32px; height: 32px; border-radius: 8px; }
          .mobile-header__brand strong { color: var(--color-primary-text); }

          .mobile-header__links { display: flex; align-items: center; gap: 14px; margin-left: auto; }
          .mobile-header__links a {
            display: inline-flex; align-items: center; min-height: 44px;
            color: var(--color-text-secondary); font-size: 0.8125rem; font-weight: 600; white-space: nowrap;
          }
          .mobile-header__links a:hover { color: var(--color-primary-text); }

          .mobile-header__controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

          .mobile-drawer {
            display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
            padding: 12px 16px; background: var(--color-surface);
            border-bottom: 1px solid var(--color-border); position: sticky; top: 64px; z-index: 89;
            box-shadow: var(--shadow-md);
          }

          .mobile-drawer__link {
            display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 10px 12px;
            border-radius: var(--radius-md); border: 1px solid var(--color-border);
            color: var(--color-text-primary); background: var(--color-bg); font-size: 0.875rem; font-weight: 600;
          }

          .mobile-drawer__link--active {
            background: var(--color-primary-btn); color: #FFFFFF; border-color: var(--color-primary-btn);
          }
        }

        @media (max-width: 640px) {
          .mobile-header__links { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
