import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Home, MapPin, ScanLine } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => (
  <section className="not-found page-enter" aria-labelledby="not-found-title">
    <div className="not-found__icon" aria-hidden="true"><ScanLine size={42} /></div>
    <p className="not-found__code">404</p>
    <h1 id="not-found-title">Halaman Tidak Ditemukan</h1>
    <p className="not-found__copy">Sepertinya halaman yang kamu cari sudah dipindahkan atau belum tersedia.</p>
    <div className="not-found__actions">
      <Button as={Link} to="/" icon={<Home size={17} />}>Beranda</Button>
      <Button as={Link} to="/scan" variant="outline" icon={<ScanLine size={17} />}>Scan Sampah</Button>
      <Button as={Link} to="/bank-sampah" variant="outline" icon={<MapPin size={17} />}>Bank Sampah</Button>
      <Button as={Link} to="/guide" variant="ghost" iconRight={<ArrowRight size={17} />} icon={<BookOpen size={17} />}>Panduan</Button>
    </div>
    <style>{`
      .not-found { min-height: 70vh; display: grid; place-items: center; align-content: center; gap: 12px; padding: 48px 20px; text-align: center; }
      .not-found__icon { display: grid; place-items: center; width: 84px; height: 84px; margin-bottom: 8px; border-radius: 28px; color: var(--color-primary-btn); background: var(--color-primary-bg); }
      .not-found__code { margin: 0; color: var(--color-primary); font: 800 4rem/1 var(--font-heading); letter-spacing: -.04em; }
      .not-found h1 { margin: 0; font-size: clamp(1.5rem, 4vw, 2rem); }
      .not-found__copy { max-width: 42ch; margin: 0 0 16px; }
      .not-found__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
      .not-found__actions a { text-decoration: none; }
    `}</style>
  </section>
);

export default NotFoundPage;
