import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ImagePlus, Layers, Recycle, Leaf, BatteryCharging, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import { CATEGORY_LIST } from '../data/wasteCategories';
import useEcoImpact from '../hooks/useEcoImpact';
import { Flame, Target } from 'lucide-react';

/**
 * Home page — Landing page with hero section and feature highlights
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { ledger, level, streak } = useEcoImpact();

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
          <div className="hero__brand-icon" aria-hidden="true">
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
              onClick={() => navigate('/scan', { state: { openUpload: true } })}
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
              <div className="hero-card__float hero-card__float--tl">
                <Recycle size={18} color="var(--color-primary-text, var(--color-primary-dark))" />
              </div>
              <div className="hero-card__float hero-card__float--tr">
                <Leaf size={16} color="var(--color-primary-text, var(--color-primary-dark))" />
              </div>
              <div className="hero-card__float hero-card__float--br">
                <Leaf size={14} color="var(--color-primary-text, var(--color-primary-dark))" />
              </div>

              <div className="hero-card__circle-wrapper">
                <div className="hero-card__circle">
                  <Layers size={64} color="white" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="hero-card__stats-grid">
              <div className="hero-card__stat-item">
                <strong className="hero-card__stat-value">3</strong>
                <span className="hero-card__stat-label">Kategori Utama</span>
              </div>
              <div className="hero-card__stat-item">
                <strong className="hero-card__stat-value">10+</strong>
                <span className="hero-card__stat-label">Jenis Sampah</span>
              </div>
              <div className="hero-card__stat-item">
                <strong className="hero-card__stat-value">Gratis</strong>
                <span className="hero-card__stat-label">Tanpa Daftar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="eco-impact-strip" aria-label="Ringkasan dampak ekologi Anda">
        <div className="eco-impact-strip__intro">
          <strong>DampakKu</strong>
          <span>Ringkasan perjalanan hijau Anda</span>
        </div>
        <div className="eco-impact-strip__stats">
          <div><span>Eco Level</span><strong>{level?.name || 'Kecambah'}</strong></div>
          <div><span>Eco Points</span><strong>{ledger?.totalPoints || 0}</strong></div>
          <div><span>CO₂e dihemat</span><strong>{Number(ledger?.co2SavedKg || 0).toFixed(2)} kg</strong></div>
          <div><span>Streak</span><strong><Flame size={15} aria-hidden="true" /> {streak || 0} hari</strong></div>
        </div>
        <div className="eco-impact-strip__actions">
          <button type="button" onClick={() => navigate('/dampak')}>Lihat DampakKu</button>
          <button type="button" onClick={() => navigate('/tantangan')}><Target size={16} aria-hidden="true" /> Main Eco Challenge</button>
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
          {CATEGORY_LIST.map((cat) => {
            const keyLower = String(cat.key || '').toLowerCase();
            const catClass =
              keyLower === 'organik'
                ? 'category-chip--organik'
                : keyLower === 'anorganik'
                  ? 'category-chip--anorganik'
                  : 'category-chip--b3';
            const iconColor =
              keyLower === 'organik'
                ? 'var(--color-organik-text, #15803D)'
                : keyLower === 'anorganik'
                  ? 'var(--color-anorganik-text, #1D4ED8)'
                  : 'var(--color-b3-text, #B91C1C)';
            return (
              <div
                key={cat.key}
                className={`category-chip ${catClass}`}
                role="listitem"
              >
                <div className="category-chip__icon-wrapper">
                  {renderIcon(cat.iconName, iconColor)}
                </div>
                <div>
                  <strong className="category-chip__label">{cat.label}</strong>
                  <p className="category-chip__desc">{cat.description.split(',').slice(0, 3).join(', ')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        .home-page {
          padding: 28px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 36px;
          background-color: var(--color-surface);
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
          background: var(--color-surface-elevated, var(--color-white));
          border: 1px solid var(--color-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
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
          background: var(--color-surface-elevated, var(--color-white));
          border-radius: var(--radius-2xl);
          padding: 32px;
          border: 1px solid var(--color-border);
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
          background: var(--color-surface, var(--color-white));
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .hero-card__float--tl { top: 10%; left: 15%; }
        .hero-card__float--tr { top: 35%; right: 10%; }
        .hero-card__float--br { bottom: 20%; right: 15%; }

        .hero-card__circle-wrapper {
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .hero-card__circle {
          width: 170px;
          height: 170px;
          background: var(--color-primary-btn, #15803D);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px rgba(21, 128, 61, 0.28);
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
          color: var(--color-primary-text, var(--color-primary-dark));
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
          border: 1px solid var(--color-border);
          transition: transform var(--transition-normal);
        }

        .category-chip--organik {
          background: var(--color-organik-bg);
          border-color: var(--color-primary-bg-md, var(--color-border));
        }
        .category-chip--organik .category-chip__label { color: var(--color-organik-text, #15803D); }

        .category-chip--anorganik {
          background: var(--color-anorganik-bg);
          border-color: var(--color-border);
        }
        .category-chip--anorganik .category-chip__label { color: var(--color-anorganik-text, #1D4ED8); }

        .category-chip--b3 {
          background: var(--color-b3-bg);
          border-color: var(--color-border);
        }
        .category-chip--b3 .category-chip__label { color: var(--color-b3-text, #B91C1C); }

        .category-chip__label {
          display: block;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .category-chip__desc {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        /* ---- Animations ---- */
        @keyframes scanPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }

        .eco-impact-strip {
          display: grid;
          grid-template-columns: 1fr 2fr auto;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          background: var(--color-surface-elevated);
        }
        .eco-impact-strip__intro, .eco-impact-strip__intro span,
        .eco-impact-strip__stats span { display: block; }
        .eco-impact-strip__intro strong { color: var(--color-text-primary); }
        .eco-impact-strip__intro span, .eco-impact-strip__stats span { color: var(--color-text-secondary); font-size: 0.8125rem; }
        .eco-impact-strip__stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        .eco-impact-strip__stats div { padding: 10px 12px; border-radius: var(--radius-md); background: var(--color-bg-secondary); }
        .eco-impact-strip__stats strong { display: flex; align-items: center; gap: 4px; color: var(--color-text-primary); margin-top: 4px; }
        .eco-impact-strip__actions { display: flex; flex-direction: column; gap: 8px; }
        .eco-impact-strip__actions button { min-height: 44px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-primary-btn); color: white; padding: 8px 12px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: filter 160ms cubic-bezier(0.16, 1, 0.3, 1); }
        .eco-impact-strip__actions button:last-child { background: var(--color-surface); color: var(--color-text-primary); }

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
          .eco-impact-strip { grid-template-columns: 1fr; }
          .eco-impact-strip__stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .eco-impact-strip__actions { flex-direction: row; }
          .eco-impact-strip__actions button { flex: 1; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
