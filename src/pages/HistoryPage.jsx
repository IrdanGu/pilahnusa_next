import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Camera, Clock, Download, Search, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import CategoryBadge from '../components/ui/Badge';
import ConfirmModal from '../components/ui/ConfirmModal';
import { SkeletonGrid } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import useHistory from '../hooks/useHistory';
import { exportHistoryAsCSV, exportHistoryAsJSON } from '../utils/exportHistory';
import { downloadBlob } from '../utils/shareCard';

const FILTER_OPTIONS = [
  { key: 'all', label: 'Semua' },
  { key: 'Organik', label: 'Organik' },
  { key: 'Anorganik', label: 'Anorganik' },
  { key: 'B3', label: 'B3' },
];

const formatDate = (isoString) => new Date(isoString).toLocaleDateString('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

const HistoryPage = () => {
  const navigate = useNavigate();
  const { isLoaded, totalScans, categoryCounts, removeFromHistory, clearAllHistory, filterByCategory } = useHistory();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const toast = useToast();

  const filtered = filterByCategory(activeFilter);
  const displayed = searchQuery
    ? filtered.filter((item) => `${item.result?.name || ''} ${item.result?.category || ''}`.toLowerCase().includes(searchQuery.toLowerCase()))
    : filtered;

  const exportHistory = (format) => {
    const blob = format === 'csv' ? exportHistoryAsCSV(displayed) : exportHistoryAsJSON(displayed);
    downloadBlob(blob, `riwayat-bilahbeu.${format === 'csv' ? 'csv' : 'json'}`);
    toast?.addToast?.(`Riwayat ${format.toUpperCase()} berhasil diekspor.`, 'success');
  };

  return (
    <div className="history-page animate-slide-up">
      <aside className="history-page__sidebar" aria-label="Filter riwayat">
        <h2 className="history-sidebar__title">Filter</h2>
        <div className="history-filters" role="group" aria-label="Filter kategori">
          {FILTER_OPTIONS.map(({ key, label }) => (
            <button key={key} id={`filter-${key}`} type="button" className={`history-filter-btn ${activeFilter === key ? 'history-filter-btn--active' : ''}`} onClick={() => setActiveFilter(key)} aria-pressed={activeFilter === key}>
              <span>{label}</span>
              <span className="history-filter-btn__count">{key === 'all' ? totalScans : (categoryCounts[key] || 0)}</span>
            </button>
          ))}
        </div>
        <div className="history-stats-card">
          <div className="history-stats-card__icon" aria-hidden="true"><BarChart3 size={18} /></div>
          <div><strong className="history-stats-card__value">{totalScans}</strong><p className="history-stats-card__label">Total Scan</p><p className="history-stats-card__sub">Riwayat tersimpan</p></div>
        </div>
        {totalScans > 0 && (
          <button type="button" className="history-clear-btn" id="btn-clear-history" onClick={() => setConfirmClear(true)}>
            <Trash2 size={16} aria-hidden="true" /> Hapus Semua Riwayat
          </button>
        )}
      </aside>

      <div className="history-page__main">
        <div className="history-main__header">
          <div><h1 className="history-main__title">Riwayat Scan</h1><p className="history-main__subtitle">Total {displayed.length} hasil scan</p></div>
          <div className="history-actions">
            <div className="history-search" role="search">
              <Search size={16} className="history-search__icon" aria-hidden="true" />
              <input type="search" className="history-search__input" placeholder="Cari nama sampah..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} id="history-search-input" aria-label="Cari nama sampah" />
            </div>
            <div className="history-export">
              <button type="button" onClick={() => exportHistory('csv')}><Download size={16} /> Ekspor CSV</button>
              <button type="button" onClick={() => exportHistory('json')}><Download size={16} /> Ekspor JSON</button>
            </div>
          </div>
        </div>

        {!isLoaded ? <SkeletonGrid count={4} /> : displayed.length === 0 ? (
          <div className="history-empty" aria-live="polite">
            <div className="history-empty__icon" aria-hidden="true"><Clock size={48} /></div>
            <h3 className="history-empty__title">{searchQuery ? 'Tidak ditemukan' : 'Belum ada riwayat'}</h3>
            <p className="history-empty__desc">{searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Mulai scan sampah untuk melihat riwayat'}</p>
            {!searchQuery && <Button variant="primary" icon={<Camera size={16} />} onClick={() => navigate('/scan')} id="btn-start-scan">Mulai Scan</Button>}
          </div>
        ) : (
          <div className="history-list" role="list">
            {displayed.map((item) => (
              <article key={item.id} className="history-item" role="listitem">
                {item.imageBase64 ? <img src={item.imageBase64} alt={`Foto ${item.result?.name}`} className="history-item__image" /> : <div className="history-item__image-placeholder" aria-hidden="true"><Camera size={20} /></div>}
                <div className="history-item__info">
                  <strong className="history-item__name">{item.result?.name}</strong>
                  <div className="history-item__meta"><CategoryBadge category={item.result?.category} size="sm" /><span className="history-item__confidence">{item.result?.confidence}% akurasi</span></div>
                  <time className="history-item__date" dateTime={item.timestamp}><Clock size={12} aria-hidden="true" />{formatDate(item.timestamp)}</time>
                </div>
                <Link className="history-item__view" to={`/result/${item.id}`} state={{ result: item.result, imageDataUrl: item.imageBase64 }} aria-label={`Lihat detail ${item.result?.name}`}>Lihat detail</Link>
                <button type="button" className="history-item__delete" onClick={() => removeFromHistory(item.id)} aria-label={`Hapus riwayat ${item.result?.name}`} title="Hapus"><Trash2 size={18} /></button>
              </article>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmClear}
        title="Hapus semua riwayat?"
        description="Riwayat scan akan dihapus. Statistik lifetime DampakKu, termasuk scan dan dampak lingkungan, tetap dipertahankan."
        confirmLabel="Hapus Semua"
        cancelLabel="Batal"
        variant="danger"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => { clearAllHistory(); setConfirmClear(false); toast?.addToast?.('Semua riwayat berhasil dihapus.', 'success'); }}
      />

      <style>{`
        .history-page{display:grid;grid-template-columns:240px 1fr;min-height:calc(100vh - 64px)}
        .history-page__sidebar{padding:24px 16px;background:var(--color-surface);border-right:1px solid var(--color-border);display:flex;flex-direction:column;gap:16px}
        .history-sidebar__title{font-size:1.125rem;font-weight:700;margin:0}.history-filters{display:flex;flex-direction:column;gap:6px}
        .history-filter-btn{min-height:44px;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border:1px solid transparent;border-radius:10px;background:transparent;cursor:pointer;font-size:.875rem;font-weight:600;color:var(--color-text-secondary)}
        .history-filter-btn:hover{background:var(--color-bg-secondary);color:var(--color-text-primary)}.history-filter-btn--active{background:var(--color-primary-btn, #15803D);color:#fff}.history-filter-btn__count{min-width:24px;height:24px;border-radius:999px;background:var(--color-bg-secondary);color:var(--color-text-primary);display:grid;place-items:center;font-size:.75rem;padding:0 6px}.history-filter-btn--active .history-filter-btn__count{background:rgba(255,255,255,.22);color:#fff}
        .history-stats-card{background:var(--color-primary-bg);border:1px solid var(--color-border);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px}.history-stats-card__icon{width:36px;height:36px;background:var(--color-surface);border-radius:8px;display:grid;place-items:center;color:var(--color-primary-text, var(--color-primary-dark))}.history-stats-card__value{display:block;font-size:1.25rem;font-weight:800;color:var(--color-primary-text, var(--color-primary-dark))}.history-stats-card__label,.history-stats-card__sub{margin:2px 0 0}.history-stats-card__label{font-size:.8125rem;font-weight:700}.history-stats-card__sub{font-size:.75rem;color:var(--color-text-secondary)}
        .history-clear-btn{min-height:44px;margin-top:auto;display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid var(--color-danger, #DC2626);border-radius:10px;background:var(--color-surface);color:var(--color-danger-text, #B91C1C);font-weight:700;cursor:pointer}
        .history-clear-btn:hover{background:var(--color-danger-bg, #FEF2F2)}
        .history-page__main{padding:24px;display:flex;flex-direction:column;gap:20px;background:var(--color-bg)}.history-main__header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.history-main__title{font-size:1.5rem;margin:0 0 4px}.history-main__subtitle{font-size:.8125rem;color:var(--color-text-secondary);margin:0}.history-actions{display:flex;align-items:center;gap:10px}
        .history-search{position:relative;display:block;width:min(320px,40vw)}.history-search__icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--color-text-tertiary)}.history-search__input{width:100%;min-height:44px;padding:10px 14px 10px 38px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface);color:var(--color-text-primary)}
        .history-export{display:flex;gap:8px}.history-export button{min-height:44px;display:flex;align-items:center;gap:6px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface);color:var(--color-text-primary);padding:8px 12px;font-weight:700;cursor:pointer}
        .history-empty{min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center}.history-empty__title{margin:0}.history-empty__desc{margin:0;color:var(--color-text-secondary)}
        .history-list{display:flex;flex-direction:column;gap:10px}.history-item{display:flex;align-items:center;gap:14px;padding:14px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:12px}.history-item__image,.history-item__image-placeholder{width:64px;height:64px;border-radius:8px;object-fit:cover;flex-shrink:0;background:var(--color-bg-secondary);display:grid;place-items:center}.history-item__info{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}.history-item__name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.history-item__meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.history-item__confidence,.history-item__date{font-size:.75rem;color:var(--color-text-secondary)}.history-item__date{display:flex;align-items:center;gap:4px}
        .history-item__view{min-height:44px;display:flex;align-items:center;border:1px solid var(--color-border);border-radius:10px;padding:8px 12px;color:var(--color-primary-text, var(--color-primary-dark));font-weight:700;text-decoration:none}.history-item__delete{width:44px;height:44px;display:grid;place-items:center;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--color-danger-text, #B91C1C);cursor:pointer}.history-item__delete:hover{background:var(--color-danger-bg, #FEF2F2)}
        @media(max-width:767px){.history-page{grid-template-columns:1fr;min-height:0}.history-page__sidebar{border-right:0;border-bottom:1px solid var(--color-border);padding:16px}.history-filters{flex-direction:row;flex-wrap:wrap}.history-filter-btn{flex:1 1 120px}.history-clear-btn{margin-top:8px}.history-page__main{padding:16px}.history-main__header{flex-direction:column}.history-actions{width:100%;flex-direction:column;align-items:stretch}.history-search{width:100%}.history-export{display:grid;grid-template-columns:1fr 1fr}.history-export button{justify-content:center}.history-item{align-items:flex-start;flex-wrap:wrap}.history-item__info{min-width:calc(100% - 82px)}.history-item__view{flex:1;justify-content:center}.history-item__delete{margin-left:auto}}
      `}</style>
    </div>
  );
};

export default HistoryPage;
