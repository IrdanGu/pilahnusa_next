import React from 'react';
import { Clock, TrendingUp, Recycle } from 'lucide-react';

const ECONOMIC_VALUE_CONFIG = {
  'Rendah':       { color: 'var(--color-text-secondary)', bg: 'var(--color-bg-secondary)', border: 'var(--color-border)' },
  'Sedang':       { color: 'var(--color-warning-text, var(--color-text-primary))', bg: 'var(--color-warning-bg, var(--color-bg-secondary))', border: 'var(--color-warning-border, var(--color-border))' },
  'Tinggi':       { color: 'var(--color-primary-dark)', bg: 'var(--color-primary-bg)', border: 'var(--color-primary-bg-md, var(--color-primary))' },
  'Sangat Tinggi':{ color: 'var(--color-info-text, var(--color-text-primary))', bg: 'var(--color-info-bg, var(--color-bg-secondary))', border: 'var(--color-info-border, var(--color-border))' },
};

/**
 * WasteStats — displays decomposition time, economic value, and recycling potential.
 * @param {string} decompositionTime
 * @param {string} economicValue
 * @param {string[]} recyclingPotential
 */
const WasteStats = ({ decompositionTime, economicValue, recyclingPotential = [] }) => {
  const evCfg = ECONOMIC_VALUE_CONFIG[economicValue] || ECONOMIC_VALUE_CONFIG['Rendah'];

  return (
    <div className="waste-stats">
      {/* Decomposition time */}
      {decompositionTime && (
        <div className="waste-stats__card">
          <div className="waste-stats__icon waste-stats__icon--gray">
            <Clock size={16} color="var(--color-text-secondary)" />
          </div>
          <div className="waste-stats__body">
            <span className="waste-stats__card-label">Waktu Terurai</span>
            <strong className="waste-stats__card-value">{decompositionTime}</strong>
          </div>
        </div>
      )}

      {/* Economic value */}
      {economicValue && (
        <div className="waste-stats__card">
          <div className="waste-stats__icon" style={{ background: evCfg.bg, border: `1px solid ${evCfg.border}` }}>
            <TrendingUp size={16} color={evCfg.color} />
          </div>
          <div className="waste-stats__body">
            <span className="waste-stats__card-label">Nilai Ekonomi</span>
            <strong className="waste-stats__card-value" style={{ color: evCfg.color }}>
              {economicValue}
            </strong>
          </div>
        </div>
      )}

      {/* Recycling potential */}
      {recyclingPotential.length > 0 && (
        <div className="waste-stats__potential">
          <div className="waste-stats__potential-header">
            <div className="waste-stats__icon waste-stats__icon--green">
              <Recycle size={16} color="var(--color-primary)" />
            </div>
            <span className="waste-stats__card-label">Potensi Daur Ulang</span>
          </div>
          <div className="waste-stats__tags">
            {recyclingPotential.map((item, i) => (
              <span key={i} className="waste-stats__tag">{item}</span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .waste-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .waste-stats__card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }
        .waste-stats__icon {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
        }
        .waste-stats__icon--gray { background: var(--color-bg-secondary); border-color: var(--color-border); }
        .waste-stats__icon--green { background: var(--color-primary-bg); border-color: var(--color-primary-bg-md); }
        .waste-stats__body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .waste-stats__card-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .waste-stats__card-value {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--color-text-primary);
          font-family: var(--font-heading);
        }
        .waste-stats__potential {
          padding: 14px 16px;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .waste-stats__potential-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .waste-stats__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .waste-stats__tag {
          display: inline-block;
          padding: 4px 10px;
          background: var(--color-primary-bg);
          border: 1px solid var(--color-primary-bg-md);
          color: var(--color-primary-dark);
          font-size: 0.78rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default WasteStats;
