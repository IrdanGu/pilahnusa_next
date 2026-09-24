import React from 'react';

/**
 * Base card container component
 */
const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
  shadow = 'md',
  style,
  id,
  as: Component = 'div',
}) => {
  const paddingMap = { sm: '12px', md: '20px', lg: '28px', none: '0' };
  const shadowMap = {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    none: 'none',
  };

  return (
    <Component
      id={id}
      className={`card ${hoverable ? 'card--hoverable' : ''} ${onClick ? 'card--clickable' : ''} ${className}`}
      onClick={onClick}
      style={{
        padding: paddingMap[padding] || padding,
        boxShadow: shadowMap[shadow] || shadow,
        ...style,
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick(e) : undefined}
    >
      {children}

      <style>{`
        .card {
          background: var(--color-white);
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border-light);
          transition: all var(--transition-normal);
        }

        .card--hoverable:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(34, 197, 94, 0.12);
        }

        .card--clickable {
          cursor: pointer;
          user-select: none;
        }

        .card--clickable:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
      `}</style>
    </Component>
  );
};

export default Card;
