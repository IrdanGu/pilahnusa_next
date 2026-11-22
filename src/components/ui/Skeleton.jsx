import React from 'react';

export const SkeletonLine = ({ width = '100%', height = '1rem', className = '' }) => (
  <span className={`skeleton skeleton-line ${className}`} aria-hidden="true" style={{ width, height }} />
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton-card ${className}`} aria-hidden="true">
    <SkeletonLine height="9rem" />
    <SkeletonLine width="65%" height="1.25rem" />
    <SkeletonLine width="90%" />
    <SkeletonLine width="45%" />
    <style>{`
      .skeleton-card { display: grid; gap: 12px; padding: 20px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); }
      .skeleton-line { display: block; border-radius: var(--radius-sm); }
    `}</style>
  </div>
);

export const SkeletonGrid = ({ count = 3, className = '' }) => (
  <div className={`skeleton-grid ${className}`} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => <SkeletonCard key={index} />)}
    <style>{`.skeleton-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }`}</style>
  </div>
);

export default SkeletonLine;
