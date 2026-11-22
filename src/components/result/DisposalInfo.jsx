import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

/**
 * DisposalInfo — displays how to properly dispose of the waste item,
 * and the environmental impact if mishandled.
 * @param {string} disposalGuide
 * @param {string} environmentalImpact
 */
const DisposalInfo = ({ disposalGuide, environmentalImpact }) => {
  if (!disposalGuide && !environmentalImpact) return null;

  return (
    <div className="disposal-info">
      {/* How to dispose */}
      {disposalGuide && (
        <div className="disposal-info__section">
          <div className="disposal-info__header">
            <div className="disposal-info__icon disposal-info__icon--blue">
              <Trash2 size={16} color="var(--color-info, var(--color-primary))" />
            </div>
            <h3 className="disposal-info__title">Cara Pembuangan</h3>
          </div>
          <p className="disposal-info__text">{disposalGuide}</p>
        </div>
      )}

      {/* Environmental impact */}
      {environmentalImpact && (
        <div className="disposal-info__section disposal-info__section--warning">
          <div className="disposal-info__header">
            <div className="disposal-info__icon disposal-info__icon--red">
              <AlertTriangle size={16} color="var(--color-danger, #B91C1C)" />
            </div>
            <h3 className="disposal-info__title disposal-info__title--red">
              Dampak Jika Salah Kelola
            </h3>
          </div>
          <p className="disposal-info__text disposal-info__text--warning">{environmentalImpact}</p>
        </div>
      )}

      <style>{`
        .disposal-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .disposal-info__section {
          background: var(--color-surface-elevated, var(--color-surface));
          border-radius: var(--radius-xl);
          padding: 18px 20px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .disposal-info__section--warning {
          background: var(--color-danger-bg, var(--color-bg-secondary));
          border-color: var(--color-danger-border, var(--color-border));
        }
        .disposal-info__header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .disposal-info__icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .disposal-info__icon--blue {         background: var(--color-info-bg, var(--color-bg-secondary)); }
        .disposal-info__icon--red  { background: var(--color-danger-bg, var(--color-bg-secondary)); }
        .disposal-info__title {
          font-size: 0.9375rem;
          font-weight: 700;
          margin: 0;
          color: var(--color-text-primary);
        }
        .disposal-info__title--red { color: var(--color-danger, #B91C1C); }
        .disposal-info__text {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.65;
        }
        .disposal-info__text--warning {
          color: var(--color-danger-text, var(--color-text-primary));
        }
      `}</style>
    </div>
  );
};

export default DisposalInfo;
