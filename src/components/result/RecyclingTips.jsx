import React from 'react';
import { Recycle, CheckCircle } from 'lucide-react';

/**
 * RecyclingTips — displays a checklist of recycling tips with green check icons.
 * @param {string[]} tips - Array of recycling tip strings
 */
const RecyclingTips = ({ tips = [] }) => {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="recycling-tips">
      <div className="recycling-tips__header">
        <div className="recycling-tips__icon">
          <Recycle size={16} color="var(--color-primary)" />
        </div>
        <h3 className="recycling-tips__title">Tips Daur Ulang</h3>
      </div>

      <ul className="recycling-tips__list" role="list">
        {tips.map((tip, i) => (
          <li key={i} className="recycling-tips__item" role="listitem">
            <CheckCircle
              size={15}
              color="var(--color-primary)"
              aria-hidden="true"
              className="recycling-tips__check"
            />
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      <style>{`
        .recycling-tips {
          background: var(--color-surface-elevated, var(--color-surface));
          border-radius: var(--radius-xl);
          padding: 18px 20px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .recycling-tips__header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .recycling-tips__icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: var(--radius-sm);
          background: var(--color-primary-bg);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .recycling-tips__title {
          font-size: 0.9375rem;
          font-weight: 700;
          margin: 0;
          color: var(--color-text-primary);
        }
        .recycling-tips__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .recycling-tips__item {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
        }
        .recycling-tips__check {
          flex-shrink: 0;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};

export default RecyclingTips;
