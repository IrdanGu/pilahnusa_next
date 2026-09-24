import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Camera,
  Clock,
  BookOpen,
  Leaf,
  Users,
  BotMessageSquare,
  MapPin,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Beranda', icon: Home, exact: true },
  { path: '/scan', label: 'Scan', icon: Camera },
  { path: '/history', label: 'Riwayat', icon: Clock },
  { path: '/chatbot', label: 'Chatbot', icon: BotMessageSquare },
  { path: '/bank-sampah', label: 'Bank Sampah', icon: MapPin },
  { path: '/team', label: 'Tim Pengembang', icon: Users },
  { path: '/guide', label: 'Cara Menggunakan', icon: BookOpen },
];

/**
 * Desktop sidebar navigation
 */
const Sidebar = () => {
  return (
    <aside className="sidebar" aria-label="Navigasi utama">
      {/* Logo */}
      <div className="sidebar__logo">
        <img
          src="/images/logo.png"
          alt="PilahNusa AI Logo"
          className="sidebar__logo-img"
        />
        <div className="sidebar__logo-text">
          <span className="sidebar__app-name">PilahNusa AI</span>
          <span className="sidebar__app-subtitle">Waste Classifier</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav" role="navigation">
        {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
            }
            aria-label={label}
          >
            <span className="sidebar__nav-icon" aria-hidden="true">
              <Icon size={20} />
            </span>
            <span className="sidebar__nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Help Card */}
      <div className="sidebar__help-card" aria-label="Bantu Lingkungan">
        <div className="sidebar__help-icon" aria-hidden="true">
          <Leaf size={16} color="var(--color-primary)" />
        </div>
        <div className="sidebar__help-text">
          <strong>Bantu Lingkungan</strong>
          <p>Setiap scan membuat perbedaan untuk bumi kita</p>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          min-height: 100vh;
          background: var(--color-white);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          padding: 20px 12px;
          gap: 8px;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          flex-shrink: 0;
        }

        @media (max-width: 1023px) {
          .sidebar {
            display: none;
          }
        }

        .sidebar__logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 8px 16px;
          border-bottom: 1px solid var(--color-border-light);
          margin-bottom: 8px;
        }

        .sidebar__logo-img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }

        .sidebar__logo-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .sidebar__app-name {
          font-family: var(--font-heading);
          font-size: 0.9375rem;
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.2;
        }

        .sidebar__app-subtitle {
          font-size: 0.6875rem;
          color: var(--color-text-tertiary);
          font-weight: 500;
        }

        .sidebar__nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .sidebar__nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 12px;
          border-radius: var(--radius-lg);
          text-decoration: none;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          font-family: var(--font-body);
          transition: all var(--transition-fast);
        }

        .sidebar__nav-item:hover:not(.sidebar__nav-item--active) {
          background: var(--color-bg);
          color: var(--color-text-primary) !important;
        }

        .sidebar__nav-item--active {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
          font-weight: 600;
        }

        .sidebar__nav-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .sidebar__help-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          background: var(--color-primary-bg);
          border: 1px solid var(--color-primary-bg-md);
          border-radius: var(--radius-lg);
          margin-top: auto;
        }

        .sidebar__help-icon {
          width: 28px;
          height: 28px;
          background: white;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }

        .sidebar__help-text strong {
          display: block;
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--color-text-primary);
          font-family: var(--font-heading);
          margin-bottom: 2px;
        }

        .sidebar__help-text p {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.4;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
