import React from 'react';
import CategoryBadge from '../ui/Badge';
import ConfidenceBar from './ConfidenceBar';
import WasteStats from './WasteStats';
import DisposalInfo from './DisposalInfo';
import RecyclingTips from './RecyclingTips';
import YoutubeTutorials from './YoutubeTutorials';

/**
 * ClassificationResultCard — main container assembling all result sub-components.
 * @param {object}   result       - Full ClassificationResult object from API
 * @param {string}   [imageUrl]   - Preview image URL or base64
 */
const ClassificationResultCard = ({ result, imageUrl }) => {
  if (!result) return null;

  return (
    <div className="crc stagger-children">
      {/* ── Hero card: image + name + badge + confidence ── */}
      <div className="crc__hero">
        {imageUrl && (
          <div className="crc__image-wrapper">
            <img
              src={imageUrl}
              alt={`Foto ${result.name}`}
              className="crc__image"
            />
            <div className="crc__image-overlay" aria-hidden="true" />
          </div>
        )}

        <div className="crc__hero-body">
          <div className="crc__badges">
            <CategoryBadge category={result.category} size="md" />
          </div>

          <h2 className="crc__name">{result.name}</h2>

          {result.description && (
            <p className="crc__desc">{result.description}</p>
          )}

          <ConfidenceBar confidence={result.confidence} />
        </div>
      </div>

      {/* ── Waste stats: decomposition, economic value, recycling potential ── */}
      <div className="crc__section-card">
        <WasteStats
          decompositionTime={result.decompositionTime}
          economicValue={result.economicValue}
          recyclingPotential={result.recyclingPotential}
        />
      </div>

      {/* ── Disposal guide + environmental impact ── */}
      <DisposalInfo
        disposalGuide={result.disposalGuide}
        environmentalImpact={result.environmentalImpact}
      />

      {/* ── Recycling tips ── */}
      <RecyclingTips tips={result.recyclingTips} />

      {/* ── YouTube tutorials ── */}
      <YoutubeTutorials tutorials={result.youtubeTutorials} />

      <style>{`
        .crc {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Hero card ── */
        .crc__hero {
          background: var(--color-surface-elevated, var(--color-surface));
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-border);
          overflow: hidden;
        }

        .crc__image-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          background: var(--color-bg-secondary);
          overflow: hidden;
        }

        .crc__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .crc__hero:hover .crc__image {
          transform: scale(1.03);
        }

        .crc__image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.18));
        }

        .crc__hero-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .crc__badges {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .crc__name {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          line-height: 1.15;
          color: var(--color-text-primary);
          font-family: var(--font-heading);
        }

        .crc__desc {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.65;
        }

        /* ── Stats wrapper card ── */
        .crc__section-card {
          background: var(--color-surface-elevated, var(--color-surface));
          border-radius: var(--radius-xl);
          padding: 18px 20px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border);
        }

        @media (max-width: 767px) {
          .crc__image-wrapper {
            height: 195px;
          }
          .crc__name {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ClassificationResultCard;
