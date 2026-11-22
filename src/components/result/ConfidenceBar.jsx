import React from 'react';
import { BarChart3 } from 'lucide-react';

/**
 * ConfidenceBar — animated progress bar showing AI classification confidence.
 * @param {number} confidence - 0–100 percent value
 */
const ConfidenceBar = ({ confidence }) => {
  const tone =
    confidence >= 85 ? 'high' :
    confidence >= 65 ? 'medium' : 'low';

  const label =
    confidence >= 85 ? 'Sangat Yakin' :
    confidence >= 65 ? 'Cukup Yakin' : 'Kurang Yakin';

  return (
    <div className="conf-bar" aria-label={`Keyakinan model: ${confidence}%`}>
      <div className="conf-bar__header">
        <span className="conf-bar__title">
          <BarChart3 size={14} aria-hidden="true" />
          Keyakinan Model
        </span>
        <div className="conf-bar__right">
          <span className={`conf-bar__label conf-bar__label--${tone}`}>{label}</span>
          <span className={`conf-bar__pct conf-bar__pct--${tone}`}>{confidence}%</span>
        </div>
      </div>
      <div
        className="conf-bar__track"
        role="progressbar"
        aria-valuenow={confidence}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="conf-bar__fill"
          style={{ width: `${confidence}%` }}
          data-tone={tone}
        />
      </div>

      <style>{`
        .conf-bar {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .conf-bar__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .conf-bar__title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }
        .conf-bar__right {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .conf-bar__label {
          font-size: 0.75rem;
          font-weight: 600;
          font-family: var(--font-body);
          padding: 3px 7px;
          border-radius: var(--radius-full);
        }
        .conf-bar__pct {
          font-size: 0.9375rem;
          font-weight: 800;
          font-family: var(--font-heading);
        }
        .conf-bar__track {
          height: 10px;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .conf-bar__label--high { background: var(--color-primary-bg); color: var(--color-primary-dark); }
        .conf-bar__label--medium { background: var(--color-warning-bg, var(--color-bg-secondary)); color: var(--color-warning-text, var(--color-text-primary)); }
        .conf-bar__label--low { background: var(--color-danger-bg, var(--color-bg-secondary)); color: var(--color-danger, #B91C1C); }
        .conf-bar__pct--high { color: var(--color-primary-dark); }
        .conf-bar__pct--medium { color: var(--color-warning-text, var(--color-text-primary)); }
        .conf-bar__pct--low { color: var(--color-danger, #B91C1C); }
        .conf-bar__fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
          animation: confBarFill 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .conf-bar__fill[data-tone="high"] { background: var(--color-primary-btn, var(--color-primary)); }
        .conf-bar__fill[data-tone="medium"] { background: var(--color-warning, #B45309); }
        .conf-bar__fill[data-tone="low"] { background: var(--color-danger, #B91C1C); }
        @keyframes confBarFill {
          from { width: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default ConfidenceBar;