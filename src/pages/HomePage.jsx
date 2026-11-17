import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ImagePlus, Layers, Recycle, Leaf, BatteryCharging, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import { CATEGORY_LIST } from '../data/wasteCategories';

/**
 * Home page — Landing page with hero section and feature highlights
 */
const HomePage = () => {
  const navigate = useNavigate();

  // Helper to render lucide icon by name
  const renderIcon = (iconName, color) => {
    switch (iconName) {
      case 'Leaf': return <Leaf size={24} color={color} />;
      case 'Recycle': return <Recycle size={24} color={color} />;
      case 'AlertTriangle': return <AlertTriangle size={24} color={color} />;
      case 'BatteryCharging': return <BatteryCharging size={24} color={color} />;
      default: return <Leaf size={24} color={color} />;
    }
  };

  return (
    <div className="home-page animate-slide-up">
      {/* Hero Section */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          {/* Brand Icon (Desktop style logo) */}
          <div className="hero__brand-icon animate-bounce-subtle" aria-hidden="true">
            <img
              src="/images/logo.png"
              alt="BilahBeu AI Logo"
              className="hero__brand-logo-img"
            />
          </div>

          <h1 className="hero__title" id="hero-title">
            BilahBeu AI
          </h1>

          <p className="hero__subtitle">
            Scan sampahmu dan pelajari cara pengelolaannya
          </p>

          {/* Hero Visual Container (Mobile prioritized) */}
          <div className="hero__visual-mobile" aria-hidden="true">
            <div className="visual-circle-outer">
              <div className="visual-circle-inner">
                <Layers size={64} color="var(--color-primary)" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero__cta" role="group" aria-label="Tindakan utama">
            <Button
              variant="primary"
              size="lg"
              icon={<Camera size={20} />}
              onClick={() => navigate('/scan')}
              id="btn-scan-sekarang"
              aria-label="Mulai scan sampah sekarang"
              fullWidth
            >
              Scan Sekarang
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={<ImagePlus size={20} />}
              onClick={() => navigate('/scan')}
              id="btn-upload-galeri"
              aria-label="Upload foto dari galeri"
              fullWidth
            >
              Upload dari Galeri
            </Button>
          </div>
        </div>

        {/* Desktop Hero Visual Card (Hidden on mobile) */}
        <div className="hero__visual-desktop" aria-hidden="true">
          <div className="hero-card">
            <div className="hero-card__visual-container">
              <div className="hero-card__float hero-card__float--tl animate-float">
                <Recycle size={18} color="var(--color-primary)" />
              </div>
              <div className="hero-card__float hero-card__float--tr animate-float-reverse">
                <Leaf size={16} color="var(--color-primary)" />
              </div>
              <div className="hero-card__float hero-card__float--br animate-float">
                <Leaf size={14} color="var(--color-primary)" />
              </div>

              <div className="hero-card__circle-wrapper">
                <div className="hero-card__circle">
                  <Layers size={64} color="white" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="hero-card__stats-grid">
              <div className="hero-card__stat-item">
                <strong className="hero-card__stat-value">95%</strong>
                <span className="hero-card__stat-label">Akurasi</span>
              </div>
              <div className="hero-card__stat-item">
                <strong className="hero-card__stat-value">10+</strong>
                <span className="hero-card__stat-label">Kategori</span>
              </div>
              <div className="hero-card__stat-item">
                <strong className="hero-card__stat-value">Fast</strong>
                <span className="hero-card__stat-label">Proses</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Preview Section - Hidden on mobile for clean landing style */}
      <section className="home-categories desktop-only" aria-labelledby="categories-heading">
        <h2 className="home-categories__title" id="categories-heading">
          Kategori Sampah
        </h2>
        <p className="home-categories__subtitle">
          BilahBeu AI dapat mengklasifikasikan berbagai jenis sampah secara otomatis
        </p>
        <div className="home-categories__grid" role="list">
          {CATEGORY_LIST.map((cat) => (
            <div
              key={cat.key}
              className="category-chip"
              role="listitem"
              style={{ borderColor: cat.color + '33', backgroundColor: cat.bgColor }}
            >
              <div className="category-chip__icon-wrapper">
                {renderIcon(cat.iconName, cat.color)}
              </div>
              <div>
                <strong className="category-chip__label" style={{ color: cat.color }}>{cat.label}</strong>
                <p className="category-chip__desc">{cat.description.split(',').slice(0, 3).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .home-page {
          padding: 28px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 40px;
          min-height: 100vh;
          background-color: var(--color-white);
        }

        /* ---- Hero ---- */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          align-items: center;
          padding: 40px 0;
        }

        .hero__content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .hero__brand-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
        }

        .hero__brand-logo-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }

        .hero__title {
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          color: var(--color-text-primary);
          margin: 0;
          text-align: center;
        }

        .hero__subtitle {
          font-size: 1.125rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin: 0;
          text-align: center;
          max-width: 320px;
          align-self: center;
        }

        /* Mobile Visual Circle */
        .hero__visual-mobile {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 32px 0;
        }

        .visual-circle-outer {
          width: 200px;
          height: 200px;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(34, 197, 94, 0.1);
        }

        .visual-circle-inner {
          width: 150px;
          height: 150px;
          background: var(--color-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.05);
        }

        .hero__cta {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 400px;
          align-self: center;
          margin-bottom: 20px;
        }

        .hero__visual-desktop {
          display: block;
        }

        /* ---- Hero Card (Desktop) ---- */
        .hero-card {
          background: var(--color-white);
          border-radius: var(--radius-2xl);
          padding: 32px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-border-light);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          width: 100%;
        }

        .hero-card__visual-container {
          position: relative;
          width: 100%;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-card__float {
          position: absolute;
          width: 48px;
          height: 48px;
          background: white;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
          z-index: 2;
        }

        .hero-card__float--tl { top: 10%; left: 15%; }
        .hero-card__float--tr { top: 35%; right: 10%; }
        .hero-card__float--br { bottom: 20%; right: 15%; }

        .hero-card__circle-wrapper {
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .hero-card__circle {
          width: 170px;
          height: 170px;
          background: var(--color-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
          animation: scanPulse 4s ease-in-out infinite;
        }

        .hero-card__stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
        }

        .hero-card__stat-item {
          background: var(--color-bg-secondary);
          border-radius: var(--radius-lg);
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;
        }

        .hero-card__stat-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-primary);
        }

        .hero-card__stat-label {
          font-size: 0.8125rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        /* ---- Category Section ---- */
        .home-categories {
          padding-top: 20px;
        }

        .home-categories__title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .home-categories__subtitle {
          font-size: 1rem;
          margin-bottom: 24px;
        }

        .home-categories__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .category-chip {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border-radius: var(--radius-xl);
          border: 1.5px solid;
          transition: transform var(--transition-normal);
        }

        /* ---- Animations ---- */
        @keyframes scanPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }

        .animate-bounce-subtle {
          animation: bounceSubtle 3s infinite ease-in-out;
        }

        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* ---- Responsive ---- */
        @media (min-width: 1024px) {
          .hero__brand-icon, .hero__visual-mobile {
            display: none;
          }
          .hero__title, .hero__subtitle {
            text-align: left;
            align-self: flex-start;
          }
          .hero__subtitle {
            max-width: 480px;
          }
          .hero__cta {
            flex-direction: row;
            align-self: flex-start;
            max-width: none;
          }
          .hero__cta .btn {
            width: auto;
          }
        }

        @media (max-width: 1023px) {
          .hero {
            grid-template-columns: 1fr;
            gap: 0;
            padding: 20px 0;
          }

          .hero__visual-desktop, .desktop-only {
            display: none;
          }

          .home-categories__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
