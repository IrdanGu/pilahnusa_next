import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

/**
 * Root layout wrapper — sidebar on desktop, bottom nav on mobile
 */
const Layout = ({ children }) => {
  return (
    <div className="layout">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="layout__main" id="main-content" tabIndex={-1}>
        {children}
      </main>

      {/* Mobile Bottom Nav */}
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

        /* Mobile & Tablet: sidebar hidden, bottom nav shown, add bottom padding */
        @media (max-width: 1023px) {
          .layout {
            flex-direction: column;
          }

          .layout__main {
            padding-bottom: 90px;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
