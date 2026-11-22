import React from 'react';
import { ExternalLink, PlayCircle, Youtube } from 'lucide-react';

/**
 * YoutubeTutorials — displays clickable YouTube tutorial links for a waste type.
 * @param {Array<{label: string, url: string}>} tutorials
 */
const YoutubeTutorials = ({ tutorials = [] }) => {
  if (!tutorials || tutorials.length === 0) return null;

  return (
    <div className="yt-tutorials">
      <div className="yt-tutorials__header">
        <div className="yt-tutorials__icon">
          <Youtube size={16} color="var(--color-danger, #B91C1C)" />
        </div>
        <h3 className="yt-tutorials__title">Tutorial Daur Ulang</h3>
      </div>

      <div className="yt-tutorials__grid">
        {tutorials.map((tutorial, i) => (
          <a
            key={i}
            href={tutorial.url}
            target="_blank"
            rel="noopener noreferrer"
            className="yt-tutorials__chip"
            aria-label={`Tonton tutorial: ${tutorial.label} (buka di tab baru)`}
          >
            <PlayCircle size={14} className="yt-tutorials__play" />
            <span>{tutorial.label}</span>
            <ExternalLink size={14} className="yt-tutorials__external" aria-hidden="true" />
            <span className="sr-only">(buka di tab baru)</span>
          </a>
        ))}
      </div>

      <style>{`
        .yt-tutorials {
          background: var(--color-surface-elevated, var(--color-surface));
          border-radius: var(--radius-xl);
          padding: 18px 20px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .yt-tutorials__header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .yt-tutorials__icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: var(--radius-sm);
          background: var(--color-bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .yt-tutorials__title {
          font-size: 0.9375rem;
          font-weight: 700;
          margin: 0;
          color: var(--color-text-primary);
        }
        .yt-tutorials__grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .yt-tutorials__chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          color: var(--color-text-primary);
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
          transition: all var(--transition-fast);
          line-height: 1.3;
        }
        .yt-tutorials__chip:hover {
          background: var(--color-primary-btn, var(--color-primary));
          border-color: var(--color-primary-btn, var(--color-primary));
          color: var(--color-primary-btn-text, #FFFFFF);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        .yt-tutorials__play {
          flex-shrink: 0;
        }
        .yt-tutorials__external {
          flex-shrink: 0;
          margin-left: 2px;
        }
        .yt-tutorials__chip:active {
          transform: translateY(0);
        }
        .yt-tutorials__chip:focus-visible {
          outline: 3px solid var(--color-focus, var(--color-primary));
          outline-offset: 3px;
        }
      `}</style>
    </div>
  );
};

export default YoutubeTutorials;
