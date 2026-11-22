import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BotMessageSquare, MapPin, Camera, Leaf } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Beranda', icon: Home, exact: true },
  { path: '/bank-sampah', label: 'Bank Sampah', icon: MapPin },
  { path: '/scan', label: 'Scan', icon: Camera, prominent: true },
  { path: '/chatbot', label: 'Chatbot', icon: BotMessageSquare },
  { path: '/dampak', label: 'DampakKu', ariaLabel: 'DampakKu', icon: Leaf },
];

/**
 * Mobile bottom tab navigation
 */
const BottomNav = () => {
  return (
    <nav className="bottom-nav" aria-label="Navigasi bawah" role="navigation">
      {NAV_ITEMS.map(({ path, label, ariaLabel, icon: Icon, exact, prominent }) => (
        <NavLink
          key={path}
          to={path}
          end={exact}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
          }
          aria-label={ariaLabel || label}
          data-prominent={prominent || undefined}
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
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
          z-index: 100;
          padding: 8px 0 max(8px, env(safe-area-inset-bottom));
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
          padding: 4px 8px;
          text-decoration: none;
          color: var(--color-text-tertiary);
          transition: all var(--transition-fast);
          border-radius: var(--radius-md);
          min-width: 56px;
          min-height: 52px;
        }

        .bottom-nav__item:hover:not(.bottom-nav__item--active) {
          color: var(--color-text-primary) !important;
        }

        .bottom-nav__item--active {
          color: var(--color-primary-text);
        }
        .bottom-nav__item[data-prominent="true"] { color: var(--color-primary-text); margin-top: -20px; }
        .bottom-nav__item[data-prominent="true"] .bottom-nav__icon {
          width: 52px; height: 52px; padding: 0; justify-content: center;
          border-radius: 50%; background: var(--color-primary-btn); color: #FFFFFF;
          box-shadow: var(--shadow-green-lg); border: 4px solid var(--color-surface);
        }
        .bottom-nav__item[data-prominent="true"] .bottom-nav__label {
          color: var(--color-primary-text);
          font-weight: 700;
        }

        .bottom-nav__item--active:not([data-prominent="true"]) .bottom-nav__icon {
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
