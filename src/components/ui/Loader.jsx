import React from 'react';
import { Recycle } from 'lucide-react';

/**
 * Full-page scanning animation loader
 */
const Loader = ({ text = 'Menganalisis sampah...', progress = 0 }) => {
  return (
    <div className="loader" aria-live="polite" aria-label={text}>
      <div className="loader__ring">
        <div className="loader__ring-inner" />
        <div className="loader__icon-wrapper">
          <Recycle size={32} color="var(--color-primary)" className="loader__icon" aria-hidden="true" />
        </div>
      </div>

      <p className="loader__text">{text}</p>

      {progress > 0 && (
        <div className="loader__progress-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="loader__progress-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}

      <p className="loader__subtext">Teknologi AI kami sedang bekerja...</p>

      <style>{`
        .loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 40px;
          min-height: 280px;
        }

        .loader__ring {
          position: relative;
          width: 90px;
          height: 90px;
        }

        .loader__ring-inner {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 3px solid var(--color-primary-bg-md);
          border-top-color: var(--color-primary);
          animation: spinSlow 1.2s linear infinite;
        }

        .loader__icon-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader__icon {
          animation: scanPulse 2s ease-in-out infinite;
        }

        .loader__text {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
        }

        .loader__subtext {
          font-size: 0.8125rem;
          color: var(--color-text-tertiary);
          margin: 0;
        }

        .loader__progress-bar {
          width: 200px;
          height: 6px;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .loader__progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary-btn) 0%, var(--color-primary-btn-hover) 100%);
          border-radius: var(--radius-full);
          transition: width 0.4s ease;
        }
      `}</style>
    </div>
  );
};

export default Loader;
