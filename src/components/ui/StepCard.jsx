import React from 'react';

/**
 * Step card component for Guide page - Redesigned to match Gambar 3
 */
const StepCard = ({ stepNumber, icon, title, description, color = '#22C55E' }) => {
  return (
    <div className="step-card">
      {/* Icon Box */}
      <div className="step-card__icon-box" style={{ backgroundColor: color }}>
        <span className="step-card__icon" aria-hidden="true">
          {React.cloneElement(icon, { color: 'white', size: 32 })}
        </span>
      </div>

      {/* Number Circle */}
      <div className="step-card__number-wrapper">
        <div className="step-card__number-circle">
          {stepNumber}
        </div>
      </div>

      {/* Content */}
      <div className="step-card__content">
        <h4 className="step-card__title">{title}</h4>
        <p className="step-card__desc">{description}</p>
      </div>

      <style>{`
        .step-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          min-width: 0;
          width: 100%;
          position: relative;
        }

        .step-card__icon-box {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          z-index: 2;
          transition: transform var(--transition-normal);
        }

        .step-card:hover .step-card__icon-box {
          transform: translateY(-5px);
        }

        .step-card__icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-card__number-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: -8px;
          z-index: 3;
        }

        .step-card__number-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-primary-btn, #15803D);
          color: white;
          font-size: 0.8125rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid var(--color-surface, var(--color-white));
          box-shadow: 0 2px 8px rgba(21, 128, 61, 0.3);
          font-family: var(--font-heading);
        }

        .step-card__content {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 10px;
        }

        .step-card__title {
          font-family: var(--font-heading);
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .step-card__desc {
          font-size: 0.8125rem;
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default StepCard;
