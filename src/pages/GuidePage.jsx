import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone, Camera, ImagePlus, Layers, CheckCircle, Star, Recycle, Camera as CameraIcon, HelpCircle, Search, Trophy, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import StepCard from '../components/ui/StepCard';
import Card from '../components/ui/Card';
import { CATEGORY_LIST as WASTE_CATEGORIES } from '../data/wasteCategories';

const STEPS = [
  {
    stepNumber: 1,
    icon: <Smartphone />,
    title: 'Buka aplikasi BilahBeu AI',
    description: 'Akses aplikasi melalui browser di perangkat mobile Anda',
    color: 'var(--color-primary)',
  },
  {
    stepNumber: 2,
    icon: <Camera />,
    title: 'Tekan tombol Scan atau Upload',
    description: 'Pilih untuk mengambil foto langsung atau upload dari galeri',
    color: 'var(--color-info, var(--color-primary))',
  },
  {
    stepNumber: 3,
    icon: <ImagePlus />,
    title: 'Ambil foto sampah atau pilih dari galeri',
    description: 'Pastikan objek sampah terlihat jelas dengan pencahayaan yang cukup',
    color: 'var(--color-warning, #B45309)',
  },
  {
    stepNumber: 4,
    icon: <Layers />,
    title: 'Tunggu proses AI menganalisis gambar',
    description: 'AI akan mengklasifikasikan jenis sampah dalam beberapa detik',
    color: 'var(--color-accent, var(--color-primary))',
  },
  {
    stepNumber: 5,
    icon: <CheckCircle />,
    title: 'Lihat hasil klasifikasi dan pelajari cara pengelolaannya',
    description: 'Dapatkan informasi lengkap tentang jenis sampah, cara pengelolaan, dan daur ulang',
    color: 'var(--color-primary)',
  },
];

const TIPS = [
  'Pastikan pencahayaan cukup terang',
  'Fokuskan kamera pada satu jenis sampah',
  'Hindari background yang terlalu ramai',
  'Gunakan foto yang jelas dan tidak blur',
];

const FEATURES = [
  'Klasifikasi otomatis dengan AI',
  'Informasi lengkap pengelolaan sampah',
  'Riwayat scan tersimpan otomatis',
  'Edukasi daur ulang dan lingkungan',
];

/**
 * Guide page — step-by-step usage instructions (Matching Gambar 3)
 */
const GuidePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return WASTE_CATEGORIES;
    return WASTE_CATEGORIES.filter((category) => {
      const searchable = [category.label, category.description, ...category.examples].join(' ').toLowerCase();
      return searchable.includes(query);
    });
  }, [searchQuery]);

  return (
    <div className="guide-page animate-slide-up">
      {/* Header (Gambar 3 style) */}
      <header className="guide-header">
        <div className="guide-header__icon-wrapper">
          <HelpCircle size={24} color="var(--color-primary)" />
        </div>
        <div className="guide-header__content">
          <h1 className="guide-header__title">Cara Menggunakan</h1>
          <p className="guide-header__subtitle">Panduan lengkap menggunakan BilahBeu AI</p>
        </div>
      </header>

      {/* Steps Section */}
      <section className="guide-steps" aria-labelledby="guide-steps-heading">
        <h2 className="sr-only" id="guide-steps-heading">Langkah Penggunaan</h2>

        {/* Connection line */}
        <div className="guide-steps__line" aria-hidden="true" />

        <div className="guide-steps__container">
          <div className="guide-steps__grid stagger-children" role="list">
            {STEPS.map((step) => (
              <div key={step.stepNumber} role="listitem" className="guide-step-item">
                <StepCard
                  stepNumber={step.stepNumber}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  color={step.color}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waste encyclopedia quick filter */}
      <section className="guide-encyclopedia" aria-labelledby="guide-encyclopedia-heading">
        <div className="guide-encyclopedia__header">
          <div>
            <h2 id="guide-encyclopedia-heading" className="guide-encyclopedia__title">Cari Jenis Sampah</h2>
            <p className="guide-encyclopedia__subtitle">Temukan kategori dan contoh sampah dengan cepat</p>
          </div>
        </div>
        <label className="guide-search" htmlFor="guide-waste-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Cari Jenis Sampah</span>
          <input
            id="guide-waste-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Contoh: baterai, kardus, minyak, plastik, daun"
          />
        </label>
        <div className="guide-category-grid" aria-live="polite">
          {filteredCategories.length > 0 ? filteredCategories.map((category) => {
            const keyLower = String(category.key || '').toLowerCase();
            const dotColor =
              keyLower === 'organik'
                ? 'var(--color-organik)'
                : keyLower === 'anorganik'
                  ? 'var(--color-anorganik)'
                  : 'var(--color-b3)';
            return (
              <article className="guide-category-card" key={category.key}>
                <div className="guide-category-card__heading">
                  <span className="guide-category-card__dot" style={{ background: dotColor }} aria-hidden="true" />
                  <h3>{category.label}</h3>
                </div>
                <p>{category.description}</p>
                <ul aria-label={`Contoh ${category.label}`}>
                  {category.examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
              </article>
            );
          }) : (
            <p className="guide-category-empty">Tidak ada kategori yang cocok. Coba kata lain seperti “kardus” atau “baterai”.</p>
          )}
        </div>
      </section>

      <section className="guide-challenge" aria-labelledby="guide-challenge-heading">
        <div className="guide-challenge__icon" aria-hidden="true"><Trophy size={26} /></div>
        <div className="guide-challenge__content">
          <h2 id="guide-challenge-heading">Uji Pengetahuanmu — Eco Challenge</h2>
          <p>Asah kemampuan memilah sampah lewat kuis interaktif yang seru.</p>
        </div>
        <Link className="guide-challenge__link" to="/tantangan">
          Mulai Tantangan <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      {/* Tips & Features */}
      <section className="guide-info" aria-labelledby="guide-info-heading">
        <h2 className="sr-only" id="guide-info-heading">Tips dan fitur unggulan</h2>

        <div className="guide-info__grid">
          {/* Tips Card */}
          <Card padding="lg" className="guide-tips-card">
            <div className="guide-tips-card__header">
              <div className="guide-tips-card__icon" aria-hidden="true">
                <Star size={18} color="var(--color-warning, #B45309)" />
              </div>
              <h3 className="guide-tips-card__title">Tips untuk hasil terbaik</h3>
            </div>
            <ul className="guide-list" role="list">
              {TIPS.map((tip) => (
                <li key={tip} className="guide-list__item" role="listitem">
                  <CheckCircle size={15} color="var(--color-primary)" aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Features Card */}
          <Card padding="lg" className="guide-features-card">
            <div className="guide-tips-card__header">
              <div className="guide-tips-card__icon guide-tips-card__icon--blue" aria-hidden="true">
                <Recycle size={18} color="var(--color-info, var(--color-primary))" />
              </div>
              <h3 className="guide-tips-card__title">Fitur Unggulan</h3>
            </div>
            <ul className="guide-list" role="list">
              {FEATURES.map((feature) => (
                <li key={feature} className="guide-list__item" role="listitem">
                  <CheckCircle size={15} color="var(--color-primary)" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* CTA */}
        <div className="guide-cta">
          <Button
            variant="primary"
            size="lg"
            icon={<CameraIcon size={18} />}
            onClick={() => navigate('/scan')}
            id="btn-guide-start-scan"
            aria-label="Mulai scan sampah sekarang"
          >
            Mulai Scan Sekarang
          </Button>
        </div>
      </section>

      <style>{`
        .guide-page {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 36px;
          background: var(--color-bg);
        }

        /* ---- Header ---- */
        .guide-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--color-border);
        }

        .guide-header__icon-wrapper {
          width: 48px;
          height: 48px;
          background: var(--color-primary-bg);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .guide-header__title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-text-primary);
          margin: 0 0 4px;
        }

        .guide-header__subtitle {
          font-size: 0.9375rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        /* ---- Steps Section ---- */
        .guide-steps {
          position: relative;
          width: 100%;
          padding: 24px 0;
        }

        .guide-steps__line {
          position: absolute;
          top: 64px;
          left: 8%;
          right: 8%;
          height: 2px;
          background: var(--color-border);
          z-index: 0;
        }

        .guide-steps__container {
          width: 100%;
          padding: 0;
        }

        .guide-steps__grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 16px;
          width: 100%;
        }

        .guide-step-item {
          min-width: 0;
        }

        /* ---- Encyclopedia search ---- */
        .guide-encyclopedia {
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 24px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          background: var(--color-surface-elevated, var(--color-surface));
        }
        .guide-encyclopedia__title {
          margin: 0 0 4px;
          color: var(--color-text-primary);
          font-size: 1.25rem;
        }
        .guide-encyclopedia__subtitle {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: .875rem;
        }
        .guide-search {
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-surface);
          color: var(--color-text-secondary);
        }
        .guide-search:focus-within {
          border-color: var(--color-primary);
          outline: 3px solid var(--color-primary-bg);
        }
        .guide-search input {
          width: 100%;
          min-height: 46px;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--color-text-primary);
          font: inherit;
        }
        .guide-search input::placeholder { color: var(--color-text-tertiary); }
        .guide-category-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .guide-category-card {
          padding: 16px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-bg-secondary);
          color: var(--color-text-secondary);
        }
        .guide-category-card__heading { display:flex; align-items:center; gap:8px; }
        .guide-category-card__heading h3 { margin:0; color:var(--color-text-primary); font-size:.9375rem; }
        .guide-category-card__dot { width:10px;height:10px;border-radius:50%;flex-shrink:0; }
        .guide-category-card p { font-size:.8125rem; line-height:1.55; margin:10px 0; }
        .guide-category-card ul { display:flex; flex-wrap:wrap; gap:6px; list-style:none; padding:0; margin:0; }
        .guide-category-card li { padding:4px 10px; border:1px solid var(--color-primary-bg-md,var(--color-border)); border-radius:var(--radius-full); background:var(--color-primary-bg); color:var(--color-primary-text,var(--color-primary-dark)); font-size:.75rem; font-weight:700; }
        .guide-category-empty { grid-column:1/-1; margin:0; color:var(--color-text-secondary); }

        .guide-challenge {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          border: 1px solid var(--color-primary-bg-md, var(--color-border));
          border-radius: var(--radius-xl);
          background: var(--color-primary-bg);
        }
        .guide-challenge__icon { width:52px;height:52px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-lg);background:var(--color-surface);color:var(--color-primary-text,var(--color-primary-dark)); }
        .guide-challenge h2 { margin:0 0 4px;color:var(--color-text-primary);font-size:1.125rem; }
        .guide-challenge p { margin:0;color:var(--color-text-secondary); }
        .guide-challenge__link { min-height:44px; display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:var(--radius-lg); background:var(--color-primary-btn, #15803D); color:#FFFFFF; font-weight:700; text-decoration:none; white-space:nowrap; }
        .guide-challenge__link:hover { background: var(--color-primary-btn-hover, #166534); color: #FFFFFF; }
        .guide-challenge__link:focus-visible { outline:3px solid var(--color-focus,var(--color-primary)); outline-offset:3px; }

        /* ---- Info Grid ---- */
        .guide-info__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .guide-tips-card, .guide-features-card {
          border: 1px solid var(--color-border);
          border-radius: 20px;
        }

        .guide-tips-card__header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .guide-tips-card__icon {
          width: 40px;
          height: 40px;
          background: var(--color-warning-bg, var(--color-bg-secondary));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .guide-tips-card__icon--blue { background: var(--color-info-bg, var(--color-bg-secondary)); }

        .guide-tips-card__title {
          font-size: 1.0625rem;
          font-weight: 700;
        }

        .guide-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .guide-list__item {
          display: flex;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .guide-cta {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        @media (max-width: 1023px) {
          .guide-info__grid { grid-template-columns: 1fr; }
          .guide-steps__line { display: none; }
          .guide-steps__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
          .guide-category-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 767px) {
          .guide-page { padding: 20px; }
          .guide-header__title { font-size: 1.25rem; }
        }

        @media (max-width: 639px) {
          .guide-page { gap: 24px; padding: 16px; }
          .guide-steps { padding: 12px 0; }
          .guide-steps__grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .guide-category-grid { grid-template-columns: 1fr; }
          .guide-encyclopedia { padding: 16px; }
          .guide-challenge {
            grid-template-columns: auto 1fr;
          }
          .guide-challenge__link { grid-column: 1 / -1; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default GuidePage;
