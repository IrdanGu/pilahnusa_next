import React from 'react';
import { getCategoryByKey } from '../../data/wasteCategories';

/**
 * Category badge component with color-coded styling
 */
const CategoryBadge = ({ category, size = 'md', showDot = true }) => {
  const cat = getCategoryByKey(category);

  const sizeStyles = {
    sm: { padding: '3px 10px', fontSize: '0.75rem', gap: '4px', dotSize: '6px' },
    md: { padding: '5px 14px', fontSize: '0.8125rem', gap: '6px', dotSize: '7px' },
    lg: { padding: '7px 18px', fontSize: '0.9375rem', gap: '7px', dotSize: '8px' },
  };

  const s = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        color: cat.textColor || cat.color,
        backgroundColor: cat.bgColor,
        border: `1.5px solid ${cat.borderColor}`,
        borderRadius: 'var(--radius-full)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {showDot && (
        <span
          aria-hidden="true"
          style={{
            width: s.dotSize,
            height: s.dotSize,
            borderRadius: '50%',
            backgroundColor: cat.color,
            flexShrink: 0,
          }}
        />
      )}
      {cat.label}
    </span>
  );
};

export default CategoryBadge;
