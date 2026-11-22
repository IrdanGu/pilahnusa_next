import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Clock3, Copy, ExternalLink, LocateFixed, MapPin, PackageSearch, Search, Send, Star, X } from 'lucide-react';
import { WASTE_BANKS } from '../data/wasteBanks';
import { buildGoogleMapsDirectionsUrl, formatDistance, sortByDistance } from '../utils/geolocationUtils';
import { getUniqueKecamatan, filterAndSortBanks } from '../utils/wasteBankFilters';
import { buildWhatsAppShareUrl, copyToClipboard } from '../utils/shareCard';
import useFavorites from '../hooks/useFavorites';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';

const LOCATION_ERROR =
  'Lokasi tidak dapat diakses. Izinkan akses lokasi untuk mencari bank sampah terdekat.';
const LOCATION_UNAVAILABLE =
  'Peramban Anda tidak mendukung akses lokasi. Silakan cari bank sampah secara manual.';

const formatCapacity = (value) => Number(Number(value).toFixed(3));

const WasteBankPage = () => {
  const [mode, setMode] = useState('terdekat');
  const [status, setStatus] = useState('loading');
  const [banks, setBanks] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [query, setQuery] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposal, setProposal] = useState({ name: '', address: '', schedule: '' });
  const isMountedRef = useRef(false);
  const requestGenerationRef = useRef(0);
  const proposalDialogRef = useRef(null);
  const proposalTriggerRef = useRef(null);
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const toast = useToast();
  const notify = (message, type = 'success') => toast?.addToast?.(message, type);

  const requestLocation = useCallback(() => {
    const requestGeneration = requestGenerationRef.current + 1;
    requestGenerationRef.current = requestGeneration;
    const canUpdateState = () => isMountedRef.current && requestGenerationRef.current === requestGeneration;
    if (!isMountedRef.current) return;
    setStatus('loading');
    setErrorMessage('');
    if (!navigator.geolocation) {
      if (canUpdateState()) {
        setStatus('error');
        setErrorMessage(LOCATION_UNAVAILABLE);
      }
      return;
    }
    const onLocationSuccess = ({ coords }) => {
      if (!canUpdateState()) return;
      const detectedLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: Number.isFinite(coords.accuracy) ? Math.round(coords.accuracy) : null,
      };
      const nearbyBanks = sortByDistance(
        WASTE_BANKS.filter((bank) => Number.isFinite(bank.latitude) && Number.isFinite(bank.longitude)),
        { latitude: coords.latitude, longitude: coords.longitude }
      );
      setUserLocation(detectedLocation);
      setBanks(nearbyBanks);
      setStatus(nearbyBanks.length ? 'success' : 'empty');
    };

    navigator.geolocation.getCurrentPosition(
      onLocationSuccess,
      (error) => {
        if (!canUpdateState()) return;
        // Fallback to standard accuracy if high-accuracy GPS times out or is unavailable
        if (error && (error.code === 2 || error.code === 3)) {
          navigator.geolocation.getCurrentPosition(
            onLocationSuccess,
            () => {
              if (!canUpdateState()) return;
              setStatus('error');
              setErrorMessage(LOCATION_ERROR);
            },
            { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
          );
          return;
        }
        setStatus('error');
        setErrorMessage(LOCATION_ERROR);
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    requestLocation();
    return () => {
      isMountedRef.current = false;
      requestGenerationRef.current += 1;
    };
  }, [requestLocation]);

  useEffect(() => {
    if (!proposalOpen) return undefined;
    const trigger = proposalTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    proposalDialogRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setProposalOpen(false);
        return;
      }
      if (event.key === 'Tab' && proposalDialogRef.current) {
        const focusable = Array.from(
          proposalDialogRef.current.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [proposalOpen]);

  const switchToJelajah = () => {
    setMode('jelajah');
    setSortBy('name');
  };

  const sourceBanks = mode === 'jelajah' ? WASTE_BANKS : banks;
  const filterBanks = mode === 'terdekat'
    ? sourceBanks.map((bank) => bank.distanceKm === 0 ? { ...bank, distanceKm: Number.MIN_VALUE } : bank)
    : sourceBanks;
  const displayedBanks = filterAndSortBanks(filterBanks, {
    query,
    kecamatan,
    status: statusFilter === 'Buka' || statusFilter === 'Tutup' ? statusFilter : '',
    favoritesOnly: statusFilter === 'Favorit',
    favoriteIds,
    sortBy: mode === 'terdekat' ? 'distance' : (sortBy === 'distance' ? 'name' : sortBy),
  });

  const proposalText = `Pengajuan Bank Sampah\nNama: ${proposal.name}\nAlamat/Kecamatan: ${proposal.address}\nJadwal: ${proposal.schedule}`;

  const copyProposal = async () => {
    const copied = await copyToClipboard(proposalText);
    notify(copied ? 'Formulir berhasil disalin.' : 'Formulir tidak dapat disalin.', copied ? 'success' : 'error');
  };

  const showList = mode === 'jelajah' || status === 'success';

  return (
    <section className="waste-bank-page" aria-labelledby="waste-bank-page-title">
      <header className="waste-bank-page__header">
        <div>
          <h1 id="waste-bank-page-title">Bank Sampah Terdekat</h1>
          <p className="waste-bank-page__intro">Temukan tempat setor sampah terdekat dari lokasi Anda.</p>
        </div>
        <Button onClick={requestLocation} variant="outline" size="sm" icon={<LocateFixed size={16} />}>
          Gunakan lokasi saya
        </Button>
      </header>

      <div className="waste-bank-page__mode" role="group" aria-label="Mode pencarian bank sampah">
        <button type="button" className={mode === 'terdekat' ? 'active' : ''} aria-pressed={mode === 'terdekat'} onClick={() => { setMode('terdekat'); setSortBy('distance'); }}>
          Terdekat (GPS)
        </button>
        <button type="button" className={mode === 'jelajah' ? 'active' : ''} aria-pressed={mode === 'jelajah'} onClick={switchToJelajah}>
          Jelajah Semua
        </button>
      </div>

      {mode === 'terdekat' && status === 'loading' && <Loader text="Mencari bank sampah terdekat..." />}

      {mode === 'terdekat' && status === 'error' && (
        <Card className="waste-bank-page__message" padding="lg">
          <div role="alert">
            <h2>Lokasi belum tersedia</h2>
            <p>{errorMessage}</p>
          </div>
          <div className="waste-bank-page__error-actions">
            <Button onClick={requestLocation} variant="outline">Coba lagi</Button>
            <Button onClick={switchToJelajah} variant="primary">Jelajahi Semua Bank Sampah</Button>
          </div>
        </Card>
      )}

      {mode === 'terdekat' && status === 'empty' && (
        <Card className="waste-bank-page__message" padding="lg">
          <PackageSearch size={36} aria-hidden="true" />
          <h2>Belum ada bank sampah</h2>
          <p>Belum ada bank sampah yang terdaftar di sekitar lokasi Anda.</p>
          <div className="waste-bank-page__error-actions">
            <Button onClick={requestLocation} variant="outline">Coba lagi</Button>
            <Button onClick={switchToJelajah} variant="primary">Jelajahi Semua Bank Sampah</Button>
          </div>
        </Card>
      )}

      {showList && (
        <section aria-labelledby="waste-bank-list-title" className="waste-bank-page__list">
          <div className="waste-bank-page__toolbar">
            <label className="waste-bank-page__search">
              <Search size={18} aria-hidden="true" />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau kecamatan..." />
            </label>
            <label>
              <span className="sr-only">Kecamatan</span>
              <select value={kecamatan} onChange={(event) => setKecamatan(event.target.value)}>
                <option value="">Semua Kecamatan</option>
                {getUniqueKecamatan(sourceBanks).map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Urutkan</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {mode === 'terdekat' && <option value="distance">Terdekat</option>}
                <option value="name">Nama A-Z</option>
                <option value="capacity">Kapasitas Terbesar</option>
              </select>
            </label>
          </div>

          <div className="waste-bank-page__chips" role="group" aria-label="Status bank sampah">
            {['Semua', 'Buka', 'Tutup', 'Favorit'].map((label) => (
              <button key={label} type="button" className={statusFilter === (label === 'Semua' ? '' : label) ? 'active' : ''} aria-pressed={statusFilter === (label === 'Semua' ? '' : label)} onClick={() => setStatusFilter(label === 'Semua' ? '' : label)}>
                {label}
              </button>
            ))}
          </div>

          <div className="waste-bank-page__list-heading">
            <div>
              <h2 id="waste-bank-list-title">{displayedBanks.length} lokasi ditemukan</h2>
              {mode === 'terdekat' && userLocation?.accuracy != null && (
                <p className="waste-bank-page__accuracy">
                  Akurasi lokasi perangkat: ±{userLocation.accuracy} m
                  {userLocation.accuracy > 100 ? ' (perkiraan Wi-Fi/IP — untuk rute paling presisi, klik tombol lokasi di Google Maps atau gunakan GPS HP)' : ' (GPS akurat)'}
                </p>
              )}
            </div>
            <button ref={proposalTriggerRef} type="button" className="waste-bank-page__proposal" onClick={() => setProposalOpen(true)}>Ajukan Bank Sampah</button>
          </div>

          <ul className="waste-bank-page__cards" aria-label="Daftar bank sampah">
            {displayedBanks.map((bank) => {
              const statusClass = bank.operatingStatus === 'Buka' ? 'open' : bank.operatingStatus === 'Tutup' ? 'closed' : 'neutral';
              const materials = bank.acceptedMaterials?.filter(Boolean);
              const bankInfo = `${bank.name}\n${bank.address}\nJam operasional: ${bank.operatingHours || 'Jam operasional tidak tersedia'}\nMenerima: ${materials?.length ? materials.join(', ') : 'Material yang diterima belum dicantumkan'}`;
              return (
                <li key={bank.id}>
                  <Card as="article" className="waste-bank-card" padding="lg" hoverable>
                    <div className="waste-bank-card__topline">
                      <h3>{bank.name}</h3>
                      <span className={`waste-bank-card__status waste-bank-card__status--${statusClass}`}>{bank.operatingStatus || 'Status tidak tersedia'}</span>
                    </div>
                    {bank.distanceKm != null && <p className="waste-bank-card__distance"><MapPin size={16} aria-hidden="true" /> {formatDistance(bank.distanceKm)}</p>}
                    <p className="waste-bank-card__address">{bank.address}</p>
                    {bank.phone && <p className="waste-bank-card__phone"><a href={`tel:${bank.phone}`}>{bank.phone}</a></p>}
                    <p className="waste-bank-card__hours"><Clock3 size={16} aria-hidden="true" /> {bank.operatingHours || 'Jam operasional tidak tersedia'}</p>
                    {Number.isFinite(bank.capacityTonsPerDay) && <p className="waste-bank-card__capacity">Kapasitas: {formatCapacity(bank.capacityTonsPerDay)} ton/hari</p>}
                    <div className="waste-bank-card__materials">
                      <span className="waste-bank-card__label">Menerima:</span>
                      {materials?.length ? materials.map((material) => <span className="waste-bank-card__material" key={material}>{material}</span>) : <span className="waste-bank-card__muted">Material yang diterima belum dicantumkan</span>}
                    </div>
                    <div className="waste-bank-card__actions">
                      <button type="button" className={`waste-bank-card__favorite ${isFavorite(bank.id) ? 'active' : ''}`} aria-label={`${isFavorite(bank.id) ? 'Hapus' : 'Tambah'} ${bank.name} ${isFavorite(bank.id) ? 'dari' : 'ke'} favorit`} aria-pressed={isFavorite(bank.id)} onClick={() => toggleFavorite(bank.id)}>
                        <Star size={20} fill={isFavorite(bank.id) ? 'currentColor' : 'none'} aria-hidden="true" />
                      </button>
                      <button type="button" className="waste-bank-card__action" onClick={async () => { const copied = await copyToClipboard(bankInfo); notify(copied ? 'Info bank sampah berhasil disalin.' : 'Info tidak dapat disalin.', copied ? 'success' : 'error'); }}><Copy size={16} aria-hidden="true" /> Salin Info</button>
                      <a className="waste-bank-card__action" href={buildWhatsAppShareUrl(bankInfo)} target="_blank" rel="noopener noreferrer"><Send size={16} aria-hidden="true" /> WhatsApp</a>
                      {Number.isFinite(bank.latitude) && Number.isFinite(bank.longitude) && (
                        <a
                          className="waste-bank-card__directions"
                          href={buildGoogleMapsDirectionsUrl(
                            bank.latitude,
                            bank.longitude,
                            userLocation?.accuracy != null && userLocation.accuracy <= 80 ? userLocation : null
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Lihat rute ke ${bank.name}`}
                        >
                          Petunjuk arah <ExternalLink size={15} aria-hidden="true" /><span className="sr-only"> (buka di tab baru)</span>
                        </a>
                      )}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
          {displayedBanks.length === 0 && <Card className="waste-bank-page__message" padding="lg"><h2>Tidak ada hasil</h2><p>Coba kata kunci atau filter lain.</p></Card>}
        </section>
      )}

      <p className="waste-bank-page__coverage">Data saat ini mencakup wilayah Kabupaten Kuningan dan sekitarnya. Bantu kami melengkapi dengan mengajukan bank sampah di daerahmu.</p>

      {proposalOpen && (
        <div className="waste-bank-modal__backdrop" onMouseDown={(event) => event.target === event.currentTarget && setProposalOpen(false)}>
          <div ref={proposalDialogRef} role="dialog" aria-modal="true" aria-labelledby="proposal-title" tabIndex={-1} className="waste-bank-modal">
            <button type="button" className="waste-bank-modal__close" onClick={() => setProposalOpen(false)} aria-label="Tutup dialog"><X size={18} /></button>
            <h2 id="proposal-title">Ajukan Bank Sampah</h2>
            <label>Nama<input value={proposal.name} onChange={(event) => setProposal((current) => ({ ...current, name: event.target.value }))} /></label>
            <label>Alamat / Kecamatan<textarea value={proposal.address} onChange={(event) => setProposal((current) => ({ ...current, address: event.target.value }))} /></label>
            <label>Jadwal<input value={proposal.schedule} onChange={(event) => setProposal((current) => ({ ...current, schedule: event.target.value }))} /></label>
            <div className="waste-bank-modal__actions">
              <Button variant="outline" onClick={copyProposal} icon={<Copy size={16} />}>Salin Formulir</Button>
              <a className="waste-bank-card__action" href={`https://wa.me/?text=${encodeURIComponent(proposalText)}`} target="_blank" rel="noopener noreferrer"><Send size={16} /> Kirim via WhatsApp</a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .waste-bank-page{max-width:920px;margin:0 auto;padding:32px 20px 56px;color:var(--color-text-primary)}
        .waste-bank-page__header{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:18px}
        .waste-bank-page__header h1{margin:0 0 8px;color:var(--color-text-primary);font-family:var(--font-heading);font-size:clamp(1.6rem,4vw,2.25rem)}
        .waste-bank-page__intro,.waste-bank-page__message p,.waste-bank-page__coverage{margin:0;color:var(--color-text-secondary)}
        .waste-bank-page__mode{display:inline-grid;grid-template-columns:1fr 1fr;gap:4px;padding:4px;margin-bottom:20px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-surface)}
        .waste-bank-page__mode button,.waste-bank-page__chips button{min-height:44px;border:0;border-radius:8px;background:transparent;color:var(--color-text-secondary);font-weight:700;cursor:pointer}
        .waste-bank-page__mode button{padding:8px 14px}.waste-bank-page__mode button.active{background:var(--color-primary-btn, #15803D);color:#fff}
        .waste-bank-page__message{display:grid;gap:14px;justify-items:start}.waste-bank-page__message h2{margin:0;font-size:1.15rem}
        .waste-bank-page__error-actions{display:flex;flex-wrap:wrap;gap:10px}
        .waste-bank-page__toolbar{display:grid;grid-template-columns:minmax(220px,1fr) 180px 180px;gap:10px;margin-bottom:10px}
        .waste-bank-page__toolbar input,.waste-bank-page__toolbar select,.waste-bank-modal input,.waste-bank-modal textarea{width:100%;min-height:44px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface);color:var(--color-text-primary);padding:10px 12px;font:inherit}
        .waste-bank-page__search{position:relative}.waste-bank-page__search svg{position:absolute;left:12px;top:13px;color:var(--color-text-tertiary)}.waste-bank-page__search input{padding-left:38px}
        .waste-bank-page__chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}.waste-bank-page__chips button{padding:8px 14px;border:1px solid var(--color-border)}.waste-bank-page__chips button.active{border-color:var(--color-primary-text, var(--color-primary-dark));background:var(--color-primary-bg);color:var(--color-primary-text, var(--color-primary-dark))}
        .waste-bank-page__list-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.waste-bank-page__list-heading h2{margin:0;font-size:1.1rem}.waste-bank-page__accuracy{margin:4px 0 0;color:var(--color-text-secondary);font-size:.8rem}
        .waste-bank-page__proposal{min-height:44px;border:1px solid var(--color-primary-text, var(--color-primary-dark));border-radius:10px;background:var(--color-surface);color:var(--color-primary-text, var(--color-primary-dark));padding:8px 14px;font-weight:700;cursor:pointer}
        .waste-bank-page__cards{display:grid;gap:16px;margin:0;padding:0;list-style:none}.waste-bank-card{display:grid;gap:10px}
        .waste-bank-card__topline{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.waste-bank-card__topline h3{margin:0;font-size:1.15rem}
        .waste-bank-card__status{padding:5px 10px;border-radius:999px;font-size:.78rem;font-weight:700;flex-shrink:0}.waste-bank-card__status--open{background:var(--color-status-open-bg, #DCFCE7);color:var(--color-status-open-text, #166534)}.waste-bank-card__status--closed{background:var(--color-status-closed-bg, #FEE2E2);color:var(--color-status-closed-text, #991B1B)}.waste-bank-card__status--neutral{background:var(--color-bg-secondary);color:var(--color-text-secondary)}
        .waste-bank-card__distance{display:flex;align-items:center;gap:6px;margin:0;color:var(--color-primary-text, var(--color-primary-dark));font-size:.9rem;font-weight:700}.waste-bank-card__hours{display:flex;align-items:center;gap:6px;margin:0;color:var(--color-text-secondary);font-size:.875rem;font-weight:500}.waste-bank-card__address,.waste-bank-card__phone,.waste-bank-card__capacity{margin:0;color:var(--color-text-secondary);font-size:.92rem}
        .waste-bank-card__materials{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.waste-bank-card__label{color:var(--color-text-secondary);font-size:.85rem}.waste-bank-card__muted{color:var(--color-text-tertiary);font-size:.85rem}.waste-bank-card__material{padding:4px 9px;border:1px solid var(--color-border-light);border-radius:999px;color:var(--color-text-secondary);font-size:.8rem}
        .waste-bank-card__actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px}.waste-bank-card__favorite{width:44px;height:44px;display:grid;place-items:center;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface);color:var(--color-text-secondary);cursor:pointer}.waste-bank-card__favorite.active{color:var(--color-accent-text, #B45309)}.waste-bank-card__action,.waste-bank-card__directions{min-height:44px;display:inline-flex;align-items:center;gap:7px;border:1px solid var(--color-border);border-radius:10px;padding:9px 12px;color:var(--color-text-primary);background:var(--color-surface);font-weight:700;text-decoration:none}.waste-bank-card__directions{border:0;background:transparent;color:var(--color-primary-text, var(--color-primary-dark))}
        .waste-bank-page__coverage{margin-top:24px;padding:14px;border:1px solid var(--color-border-light);border-radius:10px}
        .waste-bank-modal__backdrop{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:20px;background:rgba(11,17,23,.62)}.waste-bank-modal{position:relative;width:min(100%,520px);display:grid;gap:12px;padding:28px;background:var(--color-surface-elevated);border:1px solid var(--color-border);border-radius:16px}.waste-bank-modal h2{margin:0 44px 8px 0}.waste-bank-modal label{display:grid;gap:6px;font-weight:700}.waste-bank-modal textarea{min-height:84px}.waste-bank-modal__close{position:absolute;top:12px;right:12px;width:44px;height:44px;display:grid;place-items:center;border:0;border-radius:10px;background:transparent;color:var(--color-text-secondary)}.waste-bank-modal__actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px}
        @media(max-width:560px){.waste-bank-page{padding-inline:16px}.waste-bank-page__header{flex-direction:column}.waste-bank-page__mode{width:100%}.waste-bank-page__mode button{padding-inline:8px}.waste-bank-page__toolbar{grid-template-columns:1fr}.waste-bank-page__list-heading{align-items:flex-start}.waste-bank-card__topline{align-items:flex-start}.waste-bank-card__actions{display:grid;grid-template-columns:44px 1fr 1fr}.waste-bank-card__directions{grid-column:1/-1}.waste-bank-modal__actions>*{width:100%;justify-content:center}}
      `}</style>
    </section>
  );
};

export default WasteBankPage;
