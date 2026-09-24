import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Clock3, ExternalLink, LocateFixed, MapPin, PackageSearch } from 'lucide-react';
import { WASTE_BANKS } from '../data/wasteBanks';
import {
  buildGoogleMapsDirectionsUrl,
  formatDistance,
  sortByDistance,
} from '../utils/geolocationUtils';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';

const LOCATION_ERROR =
  'Lokasi tidak dapat diakses. Izinkan akses lokasi untuk mencari bank sampah terdekat.';
const LOCATION_UNAVAILABLE =
  'Peramban Anda tidak mendukung akses lokasi. Silakan cari bank sampah secara manual.';

const WasteBankPage = () => {
  const [status, setStatus] = useState('loading');
  const [banks, setBanks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const isMountedRef = useRef(false);
  const requestGenerationRef = useRef(0);

  const requestLocation = useCallback(() => {
    const requestGeneration = requestGenerationRef.current + 1;
    requestGenerationRef.current = requestGeneration;
    const canUpdateState = () =>
      isMountedRef.current && requestGenerationRef.current === requestGeneration;

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

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!canUpdateState()) return;
        const nearbyBanks = sortByDistance(WASTE_BANKS, {
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setBanks(nearbyBanks);
        setStatus(nearbyBanks.length ? 'success' : 'empty');
      },
      () => {
        if (!canUpdateState()) return;
        setStatus('error');
        setErrorMessage(LOCATION_ERROR);
      },
      { timeout: 10000, maximumAge: 300000, enableHighAccuracy: false }
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

  return (
    <section
      className="waste-bank-page"
      aria-labelledby="waste-bank-page-title"
    >
      <header className="waste-bank-page__header">
        <div>
          <p className="waste-bank-page__eyebrow">Jelajah lingkungan</p>
          <h1 id="waste-bank-page-title">Bank Sampah Terdekat</h1>
          <p className="waste-bank-page__intro">
            Temukan tempat setor sampah terdekat dari lokasi Anda.
          </p>
        </div>
        <div className="waste-bank-page__header-actions">
          <Button
            onClick={requestLocation}
            variant="outline"
            size="sm"
            icon={<LocateFixed size={16} />}
          >
            Gunakan lokasi saya
          </Button>
          <MapPin aria-hidden="true" size={40} />
        </div>
      </header>

      {status === 'loading' && <Loader text="Mencari bank sampah terdekat..." />}

      {status === 'error' && (
        <Card className="waste-bank-page__message" padding="lg">
          <div role="alert">
            <h2>Lokasi belum tersedia</h2>
            <p>{errorMessage}</p>
          </div>
          <Button onClick={requestLocation} variant="outline">
            Coba lagi
          </Button>
        </Card>
      )}

      {status === 'empty' && (
        <Card className="waste-bank-page__message" padding="lg">
          <PackageSearch size={36} aria-hidden="true" />
          <h2>Belum ada bank sampah</h2>
          <p>Belum ada bank sampah yang terdaftar di sekitar lokasi Anda.</p>
          <Button onClick={requestLocation} variant="outline">
            Coba lagi
          </Button>
        </Card>
      )}

      {status === 'success' && (
        <section
          aria-labelledby="waste-bank-list-title"
          className="waste-bank-page__list"
        >
          <div className="waste-bank-page__list-heading">
            <h2 id="waste-bank-list-title">{banks.length} lokasi ditemukan</h2>
            <span>Diurutkan dari yang terdekat</span>
          </div>
          <ul className="waste-bank-page__cards" aria-label="Daftar bank sampah">
            {banks.map((bank) => (
              <li key={bank.id}>
                <Card as="article" className="waste-bank-card" padding="lg" hoverable>
                  <div className="waste-bank-card__topline">
                    <h3>{bank.name}</h3>
                    <span className="waste-bank-card__status">{bank.operatingStatus}</span>
                  </div>
                  <p className="waste-bank-card__distance">
                    <MapPin size={16} aria-hidden="true" /> {formatDistance(bank.distanceKm)}
                  </p>
                  <p className="waste-bank-card__address">{bank.address}</p>
                  <p className="waste-bank-card__hours">
                    <Clock3 size={16} aria-hidden="true" /> {bank.operatingHours}
                  </p>
                  <div className="waste-bank-card__materials">
                    <span className="waste-bank-card__label">Menerima:</span>
                    {bank.acceptedMaterials.map((material) => (
                      <span className="waste-bank-card__material" key={material}>
                        {material}
                      </span>
                    ))}
                  </div>
                  <a
                    className="waste-bank-card__directions"
                    href={buildGoogleMapsDirectionsUrl(bank.latitude, bank.longitude)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Lihat rute ke ${bank.name}`}
                  >
                    Petunjuk arah <ExternalLink size={15} aria-hidden="true" />
                  </a>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      <style>{`
        .waste-bank-page {
          max-width: 920px;
          margin: 0 auto;
          padding: 32px 20px 56px;
          color: var(--color-text-primary);
        }
        .waste-bank-page__header {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: flex-start;
          margin-bottom: 28px;
          color: var(--color-primary);
        }
        .waste-bank-page__header h1 {
          margin: 4px 0 8px;
          color: var(--color-text-primary);
          font-family: var(--font-heading);
          font-size: clamp(1.6rem, 4vw, 2.25rem);
        }
        .waste-bank-page__header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }
        .waste-bank-page__eyebrow {
          margin: 0;
          color: var(--color-primary);
          font-size: .8rem;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .waste-bank-page__intro, .waste-bank-page__message p {
          margin: 0;
          color: var(--color-text-secondary);
        }
        .waste-bank-page__list {
          display: block;
        }
        .waste-bank-page__cards {
          display: grid;
          gap: 16px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .waste-bank-page__list-heading {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 4px;
        }
        .waste-bank-page__list-heading h2 {
          margin: 0;
          font-size: 1.1rem;
        }
        .waste-bank-page__list-heading span {
          color: var(--color-text-tertiary);
          font-size: .85rem;
        }
        .waste-bank-page__message {
          display: grid;
          gap: 14px;
          justify-items: start;
        }
        .waste-bank-page__message h2 { margin: 0; font-size: 1.15rem; }
        .waste-bank-card { display: grid; gap: 10px; }
        .waste-bank-card__topline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .waste-bank-card__topline h3 { margin: 0; font-size: 1.15rem; }
        .waste-bank-card__status {
          color: var(--color-primary-dark);
          font-size: .85rem;
          font-weight: 700;
        }
        .waste-bank-card__distance, .waste-bank-card__hours {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
          color: var(--color-primary-dark);
          font-size: .9rem;
          font-weight: 600;
        }
        .waste-bank-card__address {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: .92rem;
        }
        .waste-bank-card__materials {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }
        .waste-bank-card__label { color: var(--color-text-secondary); font-size: .85rem; }
        .waste-bank-card__material {
          padding: 4px 9px;
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-full);
          color: var(--color-text-secondary);
          font-size: .8rem;
        }
        .waste-bank-card__directions {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
          margin-top: 4px;
          color: var(--color-primary-dark);
          font-weight: 700;
          text-decoration: none;
        }
        .waste-bank-card__directions:hover { text-decoration: underline; }
        @media (max-width: 560px) {
          .waste-bank-page { padding-inline: 16px; }
          .waste-bank-page__header {
            flex-direction: column;
          }
          .waste-bank-page__header-actions {
            align-items: stretch;
            flex-direction: column;
            width: 100%;
          }
          .waste-bank-page__header-actions .btn {
            width: 100%;
            min-width: 0;
          }
          .waste-bank-page__header-actions > svg {
            align-self: flex-start;
          }
          .waste-bank-page__list-heading { display: block; }
          .waste-bank-page__list-heading span { display: block; margin-top: 4px; }
        }
      `}</style>
    </section>
  );
};

export default WasteBankPage;
