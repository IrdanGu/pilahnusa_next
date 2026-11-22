import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const ConfirmModal = ({
  open = false, title = 'Konfirmasi tindakan', description,
  confirmLabel = 'Konfirmasi', cancelLabel = 'Batal', variant = 'primary',
  onConfirm, onCancel,
}) => {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement;
    dialogRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel?.();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus.current?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="confirm-modal__backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel?.()}>
      <div className="confirm-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" aria-describedby={description ? 'confirm-modal-description' : undefined} tabIndex={-1}>
        <button type="button" className="confirm-modal__close" onClick={onCancel} aria-label="Tutup dialog"><X size={18} /></button>
        <h2 id="confirm-modal-title">{title}</h2>
        {description && <p id="confirm-modal-description">{description}</p>}
        <div className="confirm-modal__actions">
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
      <style>{`
        .confirm-modal__backdrop { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 20px; background: rgba(11, 17, 23, .62); }
        .confirm-modal { position: relative; width: min(100%, 440px); padding: 28px; background: var(--color-surface-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); }
        .confirm-modal h2 { margin: 0 32px 8px 0; font-size: 1.25rem; }
        .confirm-modal p { margin: 0 0 24px; }
        .confirm-modal__close { position: absolute; top: 12px; right: 12px; min-width: 44px; min-height: 44px; display: grid; place-items: center; color: var(--color-text-secondary); border-radius: var(--radius-md); }
        .confirm-modal__close:hover { background: var(--color-bg-secondary); color: var(--color-text-primary); }
        .confirm-modal__actions { display: flex; justify-content: flex-end; gap: 10px; }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
