import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, Camera, Check, Copy, Earth, Flame, Globe, Leaf, MapPin, MessageCircle, Recycle,
  RotateCcw, ScanLine, ShieldAlert, ShieldCheck, Sparkles, Sprout,
  Trophy, Share2, Zap,
} from 'lucide-react';
import useEcoImpact from '../hooks/useEcoImpact';
import { ECO_BADGES, ECO_LEVELS, TOTAL_BADGES } from '../data/ecoImpactData';
import {
  generateImpactShareCard,
  shareOrDownloadCard,
  buildWhatsAppShareUrl,
  copyToClipboard,
} from '../utils/shareCard';
import ConfirmModal from '../components/ui/ConfirmModal';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

const LEVEL_ICONS = { Sprout, Leaf, Recycle, Award, Earth, Globe, ShieldCheck };
const BADGE_ICONS = { Sparkles, ScanLine, Camera, ShieldAlert, Flame, Zap, Trophy, MapPin };

const ImpactPage = () => {
  const {
    ledger, level, nextLevel, progressPercent, streak, badges,
    unlockedCount, weeklyActivity, resetImpact,
  } = useEcoImpact();
  const toast = useToast();
  const [resetOpen, setResetOpen] = useState(false);
  const unlockedIds = new Set((badges || []).map((badge) => badge.id));
  const LevelIcon = LEVEL_ICONS[level?.icon] || Sprout;
  const levelIndex = ECO_LEVELS.findIndex((item) => item.id === level?.id);
  const safeWeekly = Array.isArray(weeklyActivity) ? weeklyActivity : [];
  const maxActivity = Math.max(1, ...safeWeekly.map((day) => Number(day.count || day.scans || 0)));
  const counts = ledger?.categoryCounts || {};
  const totalCategories = ['Organik', 'Anorganik', 'B3'].reduce(
    (sum, category) => sum + (Number(counts[category]) || 0),
    0,
  );

  const shareCard = async () => {
    try {
      const blob = await generateImpactShareCard({
        levelName: level?.name,
        totalScans: ledger.totalScans,
        totalPoints: ledger.totalPoints,
        co2SavedKg: ledger.co2SavedKg,
        streak,
        unlockedBadges: badges,
      });
      await shareOrDownloadCard({
        blob,
        filename: 'dampakku-bilahbeu.png',
        title: 'DampakKu BilahBeu AI',
        text: `Level ${level?.name} - ${ledger.totalPoints} Eco Points`,
      });
      toast?.addToast?.('Kartu DampakKu siap dibagikan.', 'success');
    } catch (error) {
      console.error('Gagal membuat kartu dampak:', error);
      toast?.addToast?.('Kartu DampakKu gagal dibuat.', 'error');
    }
  };

  const shareWhatsApp = () => {
    const text = `Perjalananku di BilahBeu AI: level ${level?.name}, ${ledger.totalScans} scan, ${ledger.totalPoints} Eco Points, dan ${Number(ledger.co2SavedKg).toFixed(2)} kg CO2e diperkirakan dihemat.`;
    window.open(buildWhatsAppShareUrl(text), '_blank', 'noopener,noreferrer');
  };

  const copyImpact = async () => {
    const text = `DampakKu - ${level?.name}: ${ledger.totalScans} scan, ${ledger.totalPoints} Eco Points, ${Number(ledger.co2SavedKg).toFixed(2)} kg CO2e diperkirakan dihemat.`;
    const copied = await copyToClipboard(text);
    toast?.addToast?.(copied ? 'Ringkasan dampak disalin.' : 'Ringkasan gagal disalin.', copied ? 'success' : 'error');
  };

  return (
    <div className="impact-page">
      <header className="impact-page__header">
        <div>
          <h1>DampakKu</h1>
          <p>Jejak kecilmu, dampak nyata bagi lingkungan.</p>
        </div>
        <div className="impact-page__header-actions" role="group" aria-label="Aksi berbagi dampak">
          <Button variant="outline" size="sm" icon={<Share2 size={16} />} onClick={shareCard}>
            Bagikan Kartu
          </Button>
          <Button variant="primary" size="sm" icon={<MessageCircle size={16} />} onClick={shareWhatsApp}>
            WhatsApp
          </Button>
          <button type="button" className="impact-page__copy" onClick={copyImpact} aria-label="Salin ringkasan dampak">
            <Copy size={17} aria-hidden="true" />
          </button>
        </div>
      </header>

      <section className="impact-level" aria-labelledby="impact-level-title">
        <div className="impact-level__icon" aria-hidden="true"><LevelIcon size={32} strokeWidth={1.8} /></div>
        <div className="impact-level__content">
          <div className="impact-level__heading">
            <div>
              <h2 id="impact-level-title">{level?.name || 'Kecambah'}</h2>
              <p>{level?.description || ECO_LEVELS[0].description}</p>
            </div>
            <span>Level {levelIndex >= 0 ? levelIndex + 1 : 1} dari {ECO_LEVELS.length}</span>
          </div>
          <div
            className="impact-level__track"
            role="progressbar"
            aria-label="Kemajuan level eco"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressPercent || 0)}
          >
            <span style={{ width: `${progressPercent || 0}%` }} />
          </div>
          <p className="impact-level__target">
            {nextLevel ? `Target berikutnya: ${nextLevel.minPoints} Eco Points · ${nextLevel.name}` : 'Level Tertinggi Tercapai'}
          </p>
        </div>
      </section>

      <section className="impact-metrics" aria-label="Metrik dampak">
        <article><span>Total Scan</span><strong className="tabular">{ledger.totalScans}</strong></article>
        <article><span>Eco Points</span><strong className="tabular">{ledger.totalPoints}</strong></article>
        <article><span>Estimasi CO₂e Dihemat</span><strong className="tabular">{Number(ledger.co2SavedKg).toFixed(2)} kg</strong></article>
        <article><span>Streak Harian</span><strong className="tabular"><Flame size={20} aria-hidden="true" /> {streak} hari</strong></article>
      </section>
      <p className="impact-metric-footnote">
        Nilai CO₂e merupakan estimasi rata-rata per item berdasarkan referensi pengelolaan sampah.
      </p>

      <div className="impact-analytics">
        <section className="impact-panel" aria-labelledby="activity-title">
          <h2 id="activity-title">Aktivitas 7 Hari Terakhir</h2>
          <div className="impact-chart" role="img" aria-label="Jumlah scan dalam tujuh hari terakhir">
            {safeWeekly.map((day) => {
              const count = Number(day.count || day.scans || 0);
              return (
                <div className="impact-chart__day" key={day.date || day.label}>
                  <span className="impact-chart__value tabular">{count}</span>
                  <div className="impact-chart__track" aria-hidden="true">
                    <span style={{ height: `${count ? Math.max(12, (count / maxActivity) * 100) : 4}%` }} />
                  </div>
                  <span className="impact-chart__label">{day.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="impact-panel" aria-labelledby="category-title">
          <h2 id="category-title">Distribusi Kategori</h2>
          <div className="impact-distribution">
            {[
              ['Organik', 'var(--color-organik)'],
              ['Anorganik', 'var(--color-anorganik)'],
              ['B3', 'var(--color-b3)'],
            ].map(([category, color]) => {
              const count = Number(counts[category]) || 0;
              const percent = totalCategories ? (count / totalCategories) * 100 : 0;
              return (
                <div className="impact-distribution__row" key={category}>
                  <div><span>{category}</span><strong className="tabular">{count}</strong></div>
                  <div className="impact-distribution__track" aria-label={`${category}: ${count}`}>
                    <span style={{ width: `${percent}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="impact-badges" aria-labelledby="badges-title">
        <div className="impact-badges__heading">
          <h2 id="badges-title">Koleksi Lencana</h2>
          <span className="tabular">{unlockedCount} / {TOTAL_BADGES}</span>
        </div>
        <div className="impact-badge-grid">
          {ECO_BADGES.map((badge) => {
            const unlocked = unlockedIds.has(badge.id);
            const BadgeIcon = BADGE_ICONS[badge.icon] || Award;
            return (
              <article className={`impact-badge ${unlocked ? 'impact-badge--unlocked' : 'impact-badge--locked'}`} key={badge.id}>
                <div className="impact-badge__icon" aria-hidden="true">
                  {unlocked ? <Check size={18} /> : <BadgeIcon size={22} strokeWidth={1.8} />}
                </div>
                <div>
                  <h3>{badge.name}</h3>
                  <p>{badge.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {ledger.totalScans === 0 && (
        <section className="impact-empty" aria-labelledby="impact-empty-title">
          <div>
            <h2 id="impact-empty-title">Mulai jejak hijau pertamamu</h2>
            <p>Pindai sampah pertama atau coba Eco Challenge untuk membuka lencana pertamamu.</p>
          </div>
          <div className="impact-empty__actions">
            <Button as={Link} to="/scan" icon={<Camera size={17} />}>Mulai Scan Pertama</Button>
            <Button as={Link} to="/tantangan" variant="outline" icon={<Trophy size={17} />}>Main Eco Challenge</Button>
          </div>
        </section>
      )}

      <footer className="impact-footer">
        <Button variant="outline" size="sm" icon={<RotateCcw size={16} />} onClick={() => setResetOpen(true)}>
          Reset Statistik Dampak
        </Button>
      </footer>

      <ConfirmModal
        open={resetOpen}
        variant="danger"
        title="Reset statistik dampak?"
        description="Total scan, Eco Points, estimasi CO₂e, streak, dan lencana terbuka akan diatur ulang."
        confirmLabel="Reset Statistik"
        cancelLabel="Batal"
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          resetImpact();
          setResetOpen(false);
          toast?.addToast?.('Statistik dampak telah direset.', 'success');
        }}
      />

      <style>{`
        .impact-page { max-width: 1100px; margin: 0 auto; padding: 32px 20px 56px; color: var(--color-text-primary); }
        .impact-page__header { display:flex; align-items:flex-start; justify-content:space-between; gap:24px; margin-bottom:24px; }
        .impact-page__header h1 { font-family:var(--font-heading); font-size:clamp(2rem,5vw,3.25rem); line-height:1.05; letter-spacing:-0.04em; }
        .impact-page__header p { margin-top:8px; color:var(--color-text-secondary); }
        .impact-page__header-actions { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .impact-page__copy { width:44px; height:44px; display:grid; place-items:center; border:1px solid var(--color-border); border-radius:var(--radius-md); background:var(--color-surface); color:var(--color-text-secondary); cursor:pointer; }
        .impact-page__copy:hover { color:var(--color-primary); background:var(--color-primary-bg); }
        .tabular { font-variant-numeric:tabular-nums; }
        .impact-level { display:grid; grid-template-columns:auto 1fr; gap:18px; align-items:center; padding:24px; border:1px solid var(--color-border); border-radius:var(--radius-xl); background:var(--color-surface-elevated); margin-bottom:16px; }
        .impact-level__icon { width:64px; height:64px; display:grid; place-items:center; border-radius:var(--radius-lg); background:var(--color-primary-bg-md); color:var(--color-primary-text, var(--color-primary)); }
        .impact-level__heading { display:flex; justify-content:space-between; gap:16px; }
        .impact-level__heading h2 { font-size:1.25rem; }
        .impact-level__heading p { margin-top:4px; color:var(--color-text-secondary); font-size:0.875rem; }
        .impact-level__heading > span { flex:none; color:var(--color-primary-text, var(--color-primary-dark)); font-size:0.8125rem; font-weight:700; }
        .impact-level__track { height:10px; margin-top:16px; overflow:hidden; border-radius:var(--radius-full); background:var(--color-bg-secondary); }
        .impact-level__track span { display:block; height:100%; border-radius:inherit; background:var(--color-primary); transition:width 700ms ease-out; }
        .impact-level__target { margin-top:8px; color:var(--color-text-secondary); font-size:0.8125rem; }
        .impact-metrics { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }
        .impact-metrics article { min-height:128px; display:flex; flex-direction:column; justify-content:space-between; padding:20px; border:1px solid var(--color-border); border-radius:var(--radius-lg); background:var(--color-surface); }
        .impact-metrics article span { color:var(--color-text-secondary); font-size:0.875rem; }
        .impact-metrics article strong { display:flex; align-items:center; gap:6px; font-size:clamp(1.25rem,3vw,1.75rem); line-height:1.1; }
        .impact-metric-footnote { margin:10px 0 24px; color:var(--color-text-secondary); font-size:0.8125rem; }
        .impact-analytics { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
        .impact-panel { min-width:0; border:1px solid var(--color-border); border-radius:var(--radius-xl); background:var(--color-surface); padding:22px; }
        .impact-panel h2,.impact-badges h2 { font-size:1.125rem; }
        .impact-chart { height:210px; display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:8px; align-items:end; margin-top:18px; }
        .impact-chart__day { height:100%; display:grid; grid-template-rows:20px 1fr 20px; gap:6px; text-align:center; }
        .impact-chart__value { color:var(--color-text-secondary); font-size:0.75rem; }
        .impact-chart__track { height:100%; display:flex; align-items:end; border-radius:var(--radius-sm); background:var(--color-bg-secondary); overflow:hidden; }
        .impact-chart__track span { width:100%; display:block; border-radius:var(--radius-sm) var(--radius-sm) 0 0; background:var(--color-primary); transition:height 500ms ease-out; }
        .impact-chart__label { color:var(--color-text-secondary); font-size:0.75rem; }
        .impact-distribution { display:flex; flex-direction:column; gap:20px; margin-top:30px; }
        .impact-distribution__row > div:first-child { display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.875rem; }
        .impact-distribution__track { height:12px; border-radius:var(--radius-full); background:var(--color-bg-secondary); overflow:hidden; }
        .impact-distribution__track span { height:100%; display:block; border-radius:inherit; transition:width 500ms ease-out; }
        .impact-badges { padding:22px; border:1px solid var(--color-border); border-radius:var(--radius-xl); background:var(--color-surface); }
        .impact-badges__heading { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
        .impact-badges__heading span { color:var(--color-primary-dark); font-weight:800; }
        .impact-badge-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; }
        .impact-badge { min-height:118px; display:flex; gap:10px; align-items:flex-start; padding:14px; border:1px solid var(--color-border); border-radius:var(--radius-lg); }
        .impact-badge--unlocked { background:var(--color-primary-bg); border-color:var(--color-primary-light); }
        .impact-badge--locked { background:var(--color-bg-secondary); color:var(--color-text-secondary); }
        .impact-badge__icon { flex:none; width:34px; height:34px; display:grid; place-items:center; border-radius:var(--radius-md); background:var(--color-surface); color:var(--color-primary); }
        .impact-badge--locked .impact-badge__icon { color:var(--color-text-tertiary); }
        .impact-badge h3 { font-size:0.875rem; margin:2px 0 5px; color:var(--color-text-primary); }
        .impact-badge p { font-size:0.75rem; line-height:1.45; }
        .impact-empty { display:flex; align-items:center; justify-content:space-between; gap:24px; margin-top:16px; padding:24px; border:1px solid var(--color-primary-light); border-radius:var(--radius-xl); background:var(--color-primary-bg); }
        .impact-empty h2 { font-size:1.125rem; }
        .impact-empty p { margin-top:6px; color:var(--color-text-secondary); }
        .impact-empty__actions { display:flex; gap:8px; flex-wrap:wrap; }
        .impact-footer { display:flex; justify-content:flex-end; margin-top:18px; }
        @media (prefers-reduced-motion: reduce) { .impact-level__track span,.impact-chart__track span,.impact-distribution__track span { transition:none; } }
        @media (max-width: 800px) {
          .impact-page { padding:24px 14px 40px; }
          .impact-page__header { flex-direction:column; }
          .impact-metrics { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .impact-analytics { grid-template-columns:1fr; }
          .impact-badge-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
        }
        @media (max-width: 640px) {
          .impact-page__header-actions { width:100%; }
          .impact-page__header-actions .btn { flex:1 1 auto; }
          .impact-level { grid-template-columns:1fr; }
          .impact-level__icon { width:52px;height:52px; }
          .impact-level__heading { flex-direction:column; }
          .impact-metrics article { min-height:116px; padding:16px; }
          .impact-chart { gap:5px; }
          .impact-badge-grid { grid-template-columns:1fr; }
          .impact-empty { align-items:stretch; flex-direction:column; }
          .impact-empty__actions { width:100%; flex-direction:column; }
          .impact-empty__actions .btn { width:100%; }
        }
      `}</style>
    </div>
  );
};

export default ImpactPage;
