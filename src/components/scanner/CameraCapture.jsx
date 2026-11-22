import { FlipHorizontal, X, Sun } from 'lucide-react';

/**
 * Camera capture component with live preview and scanner UI
 */
const CameraCapture = ({
  videoRef,
  isActive,
  isLoading,
  error,
  onCapture,
  onToggleCamera,
  onStop,
  hasTorch = false,
  torchOn = false,
  onToggleTorch,
}) => {
  return (
    <div className="camera-capture">
      {/* Camera viewport */}
      <div className="camera-capture__viewport">
        {/* Video element */}
        <video
          ref={videoRef}
          className="camera-capture__video"
          autoPlay
          playsInline
          muted
          aria-label="Live camera preview"
        />

        {/* Scanner overlay corners */}
        <div className="camera-capture__overlay" aria-hidden="true">
          <div className="camera-capture__corners">
            <span className="corner corner--tl" />
            <span className="corner corner--tr" />
            <span className="corner corner--bl" />
            <span className="corner corner--br" />
          </div>
          {/* Scanner line */}
          <div className="camera-capture__scan-line" />
          <p className="camera-capture__hint">Arahkan kamera ke sampah</p>
          <p className="camera-capture__hint-sub">Pastikan objek terlihat jelas dan pencahayaan cukup</p>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="camera-capture__loading" role="status" aria-label="Memuat kamera...">
            <div className="camera-capture__spinner" />
            <span>Memuat kamera...</span>
          </div>
        )}

        {/* Error overlay */}
        {error && !isLoading && (
          <div className="camera-capture__error" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Top actions */}
        <div className="camera-capture__top-actions">
          <button
            className="camera-capture__action-btn"
            onClick={onStop}
            aria-label="Tutup kamera"
            title="Tutup"
          >
            <X size={18} color="white" />
          </button>
          {isActive && (
            <div className="camera-capture__status" role="status" aria-live="polite">
              Kamera Aktif
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="camera-capture__controls">
        <button
          className="camera-capture__ctrl-btn"
          onClick={onToggleCamera}
          aria-label="Ganti kamera"
          title="Ganti kamera"
        >
          <FlipHorizontal size={20} />
        </button>

        <button
          className="camera-capture__shutter"
          onClick={onCapture}
          disabled={!isActive || isLoading}
          aria-label="Ambil foto"
        >
          <span className="camera-capture__shutter-inner" />
        </button>

        {hasTorch && (
          <button
            className="camera-capture__ctrl-btn"
            onClick={onToggleTorch}
            aria-label={torchOn ? 'Matikan flashlight' : 'Nyalakan flashlight'}
            title={torchOn ? 'Matikan flashlight' : 'Nyalakan flashlight'}
            aria-pressed={torchOn}
            style={torchOn ? { background: 'var(--color-primary)', color: '#fff' } : undefined}
          >
            <Sun size={20} />
          </button>
        )}
      </div>

      <style>{`
        .camera-capture {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--color-dark-bg);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .camera-capture__viewport {
          position: relative;
          flex: 1;
          background: #000;
          min-height: 300px;
          overflow: hidden;
        }

        .camera-capture__video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .camera-capture__overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 24px;
          gap: 4px;
        }

        .camera-capture__corners {
          position: absolute;
          inset: 20%;
        }

        .corner {
          position: absolute;
          width: 28px;
          height: 28px;
          border-color: var(--color-primary);
          border-style: solid;
          animation: cornerBlink 2s ease-in-out infinite;
        }

        .corner--tl { top: 0; left: 0; border-width: 3px 0 0 3px; border-radius: 2px 0 0 0; }
        .corner--tr { top: 0; right: 0; border-width: 3px 3px 0 0; border-radius: 0 2px 0 0; }
        .corner--bl { bottom: 0; left: 0; border-width: 0 0 3px 3px; border-radius: 0 0 0 2px; }
        .corner--br { bottom: 0; right: 0; border-width: 0 3px 3px 0; border-radius: 0 0 2px 0; }

        .camera-capture__scan-line {
          position: absolute;
          left: 20%;
          right: 20%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
          animation: scanLine 2.5s ease-in-out infinite;
          border-radius: var(--radius-full);
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }

        .camera-capture__hint {
          font-family: var(--font-heading);
          font-size: 0.9375rem;
          font-weight: 700;
          color: white;
          margin: 0;
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }

        .camera-capture__hint-sub {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.7);
          margin: 0;
          text-align: center;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        .camera-capture__loading,
        .camera-capture__error {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(0,0,0,0.7);
          color: white;
          font-size: 0.9rem;
        }

        .camera-capture__spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255,255,255,0.2);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spinSlow 1s linear infinite;
        }

        .camera-capture__top-actions {
          position: absolute;
          top: 12px;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }

        .camera-capture__action-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(0,0,0,0.45);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          transition: background var(--transition-fast);
        }

        .camera-capture__action-btn:hover {
          background: rgba(0,0,0,0.7);
        }

        .camera-capture__status {
          min-height: 44px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          border: 1px solid rgba(255,255,255,0.24);
          border-radius: 999px;
          background: rgba(0,0,0,0.58);
          color: white;
          font-size: 0.8125rem;
          font-weight: 700;
          backdrop-filter: blur(8px);
        }

        .camera-capture__controls {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 20px;
          background: var(--color-dark-bg);
        }

        .camera-capture__ctrl-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: background var(--transition-fast);
        }

        .camera-capture__ctrl-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .camera-capture__shutter {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: white;
          border: 4px solid rgba(255,255,255,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.2);
        }

        .camera-capture__shutter:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 0 5px rgba(255,255,255,0.25);
        }

        .camera-capture__shutter:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .camera-capture__shutter-inner {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--color-primary);
          display: block;
        }
      `}</style>
    </div>
  );
};

export default CameraCapture;
