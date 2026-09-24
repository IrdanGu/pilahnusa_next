import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Clock, BookOpen, BotMessageSquare, MapPin } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Beranda', icon: Home, exact: true },
  { path: '/history', label: 'Riwayat', icon: Clock },
  { path: '/chatbot', label: 'Chatbot', icon: BotMessageSquare },
  { path: '/bank-sampah', label: 'Bank Sampah', icon: MapPin },
  { path: '/guide', label: 'Panduan', icon: BookOpen },
];

/**
 * Mobile bottom tab navigation
 */
const BottomNav = () => {
  return (
    <nav className="bottom-nav" aria-label="Navigasi bawah" role="navigation">
      {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => (
        <NavLink
          key={path}
          to={path}
          end={exact}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
          }
          aria-label={label}
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            <Icon size={22} />
          </span>
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}

      <style>{`
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--color-white);
          border-top: 1px solid var(--color-border);
          z-index: 100;
          padding: 8px 0 env(safe-area-inset-bottom, 8px);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
        }

        @media (max-width: 1023px) {
          .bottom-nav {
            display: flex;
            align-items: center;
            justify-content: space-around;
          }
        }

        .bottom-nav__item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 6px 16px;
          text-decoration: none;
          color: var(--color-text-tertiary);
          transition: all var(--transition-fast);
          border-radius: var(--radius-md);
          min-width: 64px;
        }

        .bottom-nav__item:hover:not(.bottom-nav__item--active) {
          color: var(--color-text-primary) !important;
        }

        .bottom-nav__item--active {
          color: var(--color-primary);
        }

        .bottom-nav__item--active .bottom-nav__icon {
          background: var(--color-primary-bg);
          border-radius: var(--radius-sm);
        }

        .bottom-nav__icon {
          display: flex;
          align-items: center;
          padding: 4px 8px;
          transition: all var(--transition-fast);
        }

        .bottom-nav__label {
          font-size: 0.6875rem;
          font-weight: 600;
          font-family: var(--font-body);
          line-height: 1;
        }
      `}</style>
    </nav>
  );
};

export default BottomNav;
