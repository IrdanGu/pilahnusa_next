import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component
 * @param {Object} props
 * @param {'primary'|'outline'|'ghost'|'danger'} props.variant
 * @param {'sm'|'md'|'lg'} props.size
 * @param {React.ReactNode} props.icon - Icon component (left side)
 * @param {React.ReactNode} props.iconRight - Icon component (right side)
 * @param {boolean} props.loading
 * @param {boolean} props.fullWidth
 * @param {string} props.className
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  as: Component = 'button',
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <Component
      type={Component === 'button' ? type : undefined}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="btn__spinner" aria-hidden="true" />
      ) : icon ? (
        <span className="btn__icon btn__icon--left" aria-hidden="true">{icon}</span>
      ) : null}
      {children && <span className="btn__text">{children}</span>}
      {!loading && iconRight && (
        <span className="btn__icon btn__icon--right" aria-hidden="true">{iconRight}</span>
      )}

      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: var(--font-body);
          font-weight: 600;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-lg);
          transition: all var(--transition-normal);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          letter-spacing: 0.01em;
        }

        .btn:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Sizes */
        .btn--sm {
          padding: 8px 16px;
          font-size: 0.8125rem;
          border-radius: var(--radius-md);
          gap: 6px;
        }
        .btn--md {
          padding: 12px 20px;
          font-size: 0.9375rem;
        }
        .btn--lg {
          padding: 15px 28px;
          font-size: 1rem;
          border-radius: var(--radius-xl);
        }

        /* Variants */
        .btn--primary {
          background: linear-gradient(135deg, var(--color-primary-btn) 0%, var(--color-primary-btn-hover) 100%);
          color: #fff;
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);
        }
        .btn--primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.45);
        }
        .btn--primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
        }

        .btn--outline {
          background: transparent;
          color: var(--color-primary-text);
          border: 1.5px solid var(--color-primary-text);
          box-shadow: none;
        }
        .btn--outline:hover:not(:disabled) {
          background: var(--color-primary-bg);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
        }

        .btn--ghost {
          background: transparent;
          color: var(--color-text-secondary);
          box-shadow: none;
        }
        .btn--ghost:hover:not(:disabled) {
          background: var(--color-bg-secondary);
          color: var(--color-text-primary);
        }

        .btn--danger {
          background: #EF4444;
          color: white;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
        }
        .btn--danger:hover:not(:disabled) {
          background: #DC2626;
          transform: translateY(-2px);
        }

        /* Width */
        .btn--full {
          width: 100%;
        }

        /* Icon */
        .btn__icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        /* Spinner */
        .btn__spinner {
          animation: spinSlow 1s linear infinite;
          flex-shrink: 0;
        }
      `}</style>
    </Component>
  );
};

export default Button;
