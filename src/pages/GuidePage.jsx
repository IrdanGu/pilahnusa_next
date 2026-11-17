import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Camera, ImagePlus, Layers, CheckCircle, Star, Recycle, Camera as CameraIcon, HelpCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import StepCard from '../components/ui/StepCard';
import Card from '../components/ui/Card';

const STEPS = [
  {
    stepNumber: 1,
    icon: <Smartphone />,
    title: 'Buka aplikasi BilahBeu AI',
    description: 'Akses aplikasi melalui browser di perangkat mobile Anda',
    color: '#22C55E',
  },
  {
    stepNumber: 2,
    icon: <Camera />,
    title: 'Tekan tombol Scan atau Upload',
    description: 'Pilih untuk mengambil foto langsung atau upload dari galeri',
    color: '#3B82F6',
  },
  {
    stepNumber: 3,
    icon: <ImagePlus />,
    title: 'Ambil foto sampah atau pilih dari galeri',
    description: 'Pastikan objek sampah terlihat jelas dengan pencahayaan yang cukup',
    color: '#F59E0B',
  },
  {
    stepNumber: 4,
    icon: <Layers />,
    title: 'Tunggu proses AI menganalisis gambar',
    description: 'AI akan mengklasifikasikan jenis sampah dalam beberapa detik',
    color: '#8B5CF6',
  },
  {
    stepNumber: 5,
    icon: <CheckCircle />,
    title: 'Lihat hasil klasifikasi dan pelajari cara pengelolaannya',
    description: 'Dapatkan informasi lengkap tentang jenis sampah, cara pengelolaan, dan daur ulang',
    color: '#22C55E',
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

  return (
    <div className="guide-page animate-slide-up">
      {/* Header (Gambar 3 style) */}
      <header className="guide-header">
        <div className="guide-header__icon-wrapper">
          <HelpCircle size={24} color="#22C55E" />
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

      {/* Tips & Features */}
      <section className="guide-info" aria-labelledby="guide-info-heading">
        <h2 className="sr-only" id="guide-info-heading">Tips dan fitur unggulan</h2>

        <div className="guide-info__grid">
          {/* Tips Card */}
          <Card padding="lg" className="guide-tips-card">
            <div className="guide-tips-card__header">
              <div className="guide-tips-card__icon" aria-hidden="true">
                <Star size={18} color="#F59E0B" />
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
                <Recycle size={18} color="#3B82F6" />
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
          gap: 40px;
          min-height: 100vh;
          background: var(--color-white);
        }

        /* ---- Header ---- */
        .guide-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--color-border-light);
        }

        .guide-header__icon-wrapper {
          width: 48px;
          height: 48px;
          background: #F0FDF4;
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
          padding: 40px 0;
        }

        .guide-steps__line {
          position: absolute;
          top: 80px; /* Half of icon box height + padding */
          left: 100px;
          right: 100px;
          height: 2px;
          background: #22C55E;
          z-index: 0;
          opacity: 0.6;
        }

        .guide-steps__container {
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0 4px;
        }

        .guide-steps__container::-webkit-scrollbar {
          display: none;
        }

        .guide-steps__grid {
          display: flex;
          gap: 0;
          min-width: max-content;
        }

        .guide-step-item {
          width: 240px;
          flex-shrink: 0;
        }

        /* ---- Info Grid ---- */
        .guide-info__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .guide-tips-card, .guide-features-card {
          border: 1.5px solid var(--color-border-light);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
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
          background: #FFFBEB;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .guide-tips-card__icon--blue { background: #EFF6FF; }

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
        }

        @media (max-width: 767px) {
          .guide-page { padding: 20px; }
          .guide-header__title { font-size: 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default GuidePage;
