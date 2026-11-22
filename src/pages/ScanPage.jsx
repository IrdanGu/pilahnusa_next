import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, ImagePlus, ArrowLeft, Sun, Focus, ScanLine, SquareStack, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import CameraCapture from '../components/scanner/CameraCapture';
import Loader from '../components/ui/Loader';
import useCamera from '../hooks/useCamera';
import useClassifier from '../hooks/useClassifier';
import useHistory from '../hooks/useHistory';
import { fileToDataUrl, compressImage, validateImageFile, urlToDataUrl } from '../utils/imageUtils';
import { sampleWastes } from '../data/sampleWastes';
import { useToast } from '../components/ui/Toast';

/** Scan page states */
const SCAN_STATE = {
  IDLE: 'idle',
  CAMERA: 'camera',
  PREVIEW: 'preview',
  ANALYZING: 'analyzing',
  ERROR: 'error',
};

const SCAN_INSTRUCTIONS = [
  { icon: Sun, title: 'Pencahayaan Cukup', desc: 'Pastikan area terang untuk hasil terbaik' },
  { icon: Focus, title: 'Fokus pada Objek', desc: 'Satu jenis sampah per scan' },
  { icon: ScanLine, title: 'Gambar Jelas', desc: 'Hindari foto yang blur atau buram' },
  { icon: SquareStack, title: 'Background Bersih', desc: 'Latar belakang yang tidak ramai' },
];

/**
 * Scan page — Camera capture or file upload with AI analysis
 */
const ScanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const [scanState, setScanState] = useState(SCAN_STATE.IDLE);
  const [capturedImage, setCapturedImage] = useState(null); // { dataUrl, base64 }
  const [analysisError, setAnalysisError] = useState(null);

  const camera = useCamera();
  const classifier = useClassifier();
  const { addToHistory } = useHistory();

  /** Handle file upload from gallery / paste / drag-and-drop */
  const processFile = useCallback(async (file) => {
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) {
      addToast(validation.error, 'error');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      const { base64, dataUrl: compressed } = await compressImage(dataUrl);
      setCapturedImage({ dataUrl: compressed, base64 });
      setScanState(SCAN_STATE.PREVIEW);
    } catch (error) {
      addToast(error.message || 'Gagal memuat gambar.', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    if (location.state?.openUpload) {
      navigate('/scan', { replace: true, state: {} });
      window.requestAnimationFrame(() => fileInputRef.current?.click());
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const handlePaste = (event) => {
      const image = Array.from(event.clipboardData?.files || []).find((file) => file.type.startsWith('image/'));
      if (image) processFile(image);
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [processFile]);

  /** Start camera mode */
  const handleStartCamera = async () => {
    setScanState(SCAN_STATE.CAMERA);
    await camera.startCamera();
  };

  /** Capture photo from camera */
  const handleCapture = async () => {
    const photo = camera.capturePhoto();
    if (!photo) return;

    camera.stopCamera();
    try {
      const { base64: compressedB64, dataUrl: compressedDataUrl } = await compressImage(photo.dataUrl);
      setCapturedImage({ dataUrl: compressedDataUrl, base64: compressedB64 });
      setScanState(SCAN_STATE.PREVIEW);
    } catch (error) {
      addToast(error.message || 'Gagal memproses foto kamera.', 'error');
      setScanState(SCAN_STATE.IDLE);
    }
  };

  const handleFileUpload = async (event) => {
    await processFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);
    const firstFile = event.dataTransfer?.files?.[0];
    if (firstFile) await processFile(firstFile);
  };

  const handleDemoSample = async (sample) => {
    try {
      const dataUrl = await urlToDataUrl(sample.imageUrl);
      const { base64, dataUrl: compressed } = await compressImage(dataUrl);
      setCapturedImage({ dataUrl: compressed, base64 });
      setScanState(SCAN_STATE.PREVIEW);
    } catch (error) {
      addToast(error.message || 'Gagal memuat sampel.', 'error');
    }
  };

  /** Analyze the captured/uploaded image */
  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setScanState(SCAN_STATE.ANALYZING);
    setAnalysisError(null);

    // Backend now returns the fully saved historyItem directly
    const historyItem = await classifier.analyze(capturedImage.base64);

    if (historyItem && historyItem.id) {
      // Save to local history (localStorage)
      addToHistory(historyItem);
      
      // Navigate to result page using the ID generated by the backend
      navigate(`/result/${historyItem.id}`, { state: { item: historyItem, fromScan: true } });
    } else {
      setAnalysisError(classifier.error || 'Analisis gagal. Coba lagi.');
      setScanState(SCAN_STATE.ERROR);
    }
  };

  /** Reset to idle state */
  const handleReset = () => {
    camera.stopCamera();
    setCapturedImage(null);
    setAnalysisError(null);
    classifier.reset();
    setScanState(SCAN_STATE.IDLE);
  };

  return (
    <div className="scan-page animate-slide-up">
      {/* Left panel — instructions */}
      <aside className="scan-page__sidebar" aria-label="Instruksi scan">
        <h1 className="scan-page__sidebar-title">Instruksi Scan</h1>
        <div className="scan-instructions" role="list">
          {SCAN_INSTRUCTIONS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="scan-instruction" role="listitem">
              <div className="scan-instruction__icon" aria-hidden="true">
                <Icon size={18} color="var(--color-primary)" />
              </div>
              <div>
                <strong className="scan-instruction__title">{title}</strong>
                <p className="scan-instruction__desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/')}
          id="btn-back-home"
          aria-label="Kembali ke beranda"
          style={{ marginTop: 'auto' }}
        >
          Kembali
        </Button>
      </aside>

      {/* Right panel — main content */}
      <div
        className={`scan-page__main${isDragging ? ' scan-page__main--dragging' : ''}`}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false); }}
        onDrop={handleDrop}
      >
        {/* IDLE STATE */}
        {scanState === SCAN_STATE.IDLE && (
          <div className="scan-idle animate-fade-in">
            <div className="scan-idle__options">
              <button
                className="scan-option-card"
                onClick={handleStartCamera}
                disabled={!camera.isCameraAvailable}
                id="btn-open-camera"
                aria-label="Buka kamera untuk scan sampah"
              >
                <div className="scan-option-card__icon-wrapper">
                  <Camera size={36} color="var(--color-primary)" />
                </div>
                <strong className="scan-option-card__title">Scan dengan Kamera</strong>
                <p className="scan-option-card__desc">Arahkan kamera ke sampah secara langsung</p>
              </button>

              <button
                className="scan-option-card"
                onClick={() => fileInputRef.current?.click()}
                id="btn-upload-file"
                aria-label="Upload foto sampah dari galeri"
              >
                <div className="scan-option-card__icon-wrapper" style={{ background: '#EFF6FF' }}>
                  <ImagePlus size={36} color="#3B82F6" />
                </div>
                <strong className="scan-option-card__title">Upload dari Galeri</strong>
                <p className="scan-option-card__desc">Pilih foto sampah dari perangkatmu</p>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="sr-only"
              id="file-input-gallery"
              aria-label="Pilih file gambar"
            />

            {!camera.isCameraAvailable && (
              <div className="scan-camera-fallback" role="note">
                Kamera tidak tersedia di perangkat/browser ini. Gunakan upload galeri, seret gambar ke area ini, atau pilih sampel demo.
              </div>
            )}

            <section className="sample-wastes" aria-labelledby="sample-wastes-title">
              <div className="sample-wastes__header">
                <h2 id="sample-wastes-title">Coba Contoh Sampah</h2>
                <span>Demo Instan</span>
              </div>
              <div className="sample-wastes__grid">
                {sampleWastes.slice(0, 4).map((sample) => (
                  <button
                    type="button"
                    className="sample-waste-card"
                    key={sample.id}
                    onClick={() => handleDemoSample(sample)}
                    aria-label={`Coba sampel ${sample.label}`}
                  >
                    <img src={sample.imageUrl} alt={sample.label} />
                    <span className="sample-waste-card__label">{sample.label}</span>
                    <span className="sample-waste-card__category">{sample.category}</span>
                  </button>
                ))}
              </div>
            </section>

            <p className="scan-idle__hint">
              Pastikan pencahayaan cukup dan objek terlihat jelas untuk hasil terbaik
            </p>
          </div>
        )}

        {/* CAMERA STATE */}
        {scanState === SCAN_STATE.CAMERA && (
          <div className="scan-camera animate-fade-in">
            <CameraCapture
              videoRef={camera.videoRef}
              isActive={camera.isActive}
              isLoading={camera.isLoading}
              error={camera.error}
              onCapture={handleCapture}
              onToggleCamera={camera.toggleCamera}
              onStop={handleReset}
              facingMode={camera.facingMode}
              hasTorch={camera.hasTorch}
              torchOn={camera.torchOn}
              onToggleTorch={camera.toggleTorch}
            />
          </div>
        )}

        {/* PREVIEW STATE */}
        {scanState === SCAN_STATE.PREVIEW && capturedImage && (
          <div className="scan-preview animate-slide-up">
            <div className="scan-preview__image-wrapper">
              <img
                src={capturedImage.dataUrl}
                alt="Foto sampah yang akan dianalisis"
                className="scan-preview__image"
              />
              <div className="scan-preview__image-overlay" aria-hidden="true">
                <CheckCircle size={24} color="white" />
                <span>Foto siap dianalisis</span>
              </div>
            </div>

            <div className="scan-preview__actions">
              <Button
                variant="outline"
                size="md"
                icon={<RotateCcw size={16} />}
                onClick={handleReset}
                id="btn-retake"
                aria-label="Ulangi foto"
              >
                Ulangi
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<ScanLine size={16} />}
                onClick={handleAnalyze}
                id="btn-analyze"
                aria-label="Analisis gambar dengan AI"
                fullWidth
              >
                Analisis Sekarang
              </Button>
            </div>
          </div>
        )}

        {/* ANALYZING STATE */}
        {scanState === SCAN_STATE.ANALYZING && (
          <div className="scan-analyzing animate-fade-in">
            {capturedImage && (
              <img
                src={capturedImage.dataUrl}
                alt="Gambar sedang dianalisis"
                className="scan-analyzing__thumbnail"
              />
            )}
            <Loader
              text="Menganalisis sampah..."
              progress={classifier.progress}
            />
          </div>
        )}

        {/* ERROR STATE */}
        {scanState === SCAN_STATE.ERROR && (
          <div className="scan-error">
            <div className="scan-error__icon" aria-hidden="true">
              <AlertCircle size={48} color="#EF4444" />
            </div>
            <h2 className="scan-error__title">Analisis Gagal</h2>
            <p className="scan-error__message">{analysisError}</p>
            <div className="scan-error__actions">
              <Button
                variant="primary"
                onClick={handleReset}
                id="btn-try-again"
                aria-label="Coba lagi"
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scan-page {
          display: grid;
          grid-template-columns: 320px 1fr;
          min-height: 100vh;
        }

        /* ---- Sidebar ---- */
        .scan-page__sidebar {
          padding: 28px 24px;
          background: var(--color-white);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .scan-page__sidebar-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        .scan-instructions {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .scan-instruction {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .scan-instruction__icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--color-primary-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid var(--color-primary-bg-md);
        }

        .scan-instruction__title {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--color-text-primary);
          font-family: var(--font-heading);
          margin-bottom: 2px;
        }

        .scan-instruction__desc {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        /* ---- Main Content ---- */
        .scan-page__main {
          background: var(--color-dark-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100%;
          padding: 20px;
        }

        /* ---- Idle ---- */
        .scan-idle {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          width: 100%;
          max-width: 520px;
        }

        .scan-idle__options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
        }

        .scan-option-card {
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-xl);
          padding: 28px 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          transition: all var(--transition-normal);
          color: white;
        }

        .scan-option-card:hover {
          background: rgba(255,255,255,0.09);
          border-color: var(--color-primary);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.15);
        }

        .scan-option-card__icon-wrapper {
          width: 72px;
          height: 72px;
          background: var(--color-primary-bg);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scan-option-card__title {
          font-family: var(--font-heading);
          font-size: 0.9375rem;
          font-weight: 700;
          color: white;
        }

        .scan-option-card__desc {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.82);
          margin: 0;
          line-height: 1.4;
        }

        .scan-idle__hint {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.84);
          text-align: center;
          margin: 0;
          max-width: 360px;
          line-height: 1.5;
        }
        .scan-page__main--dragging {
          outline: 3px solid var(--color-primary);
          outline-offset: -8px;
        }
        .scan-camera-fallback {
          width: 100%;
          color: rgba(255,255,255,0.86);
          background: rgba(0,0,0,0.28);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: var(--radius-lg);
          padding: 12px 14px;
          font-size: 0.8125rem;
          text-align: center;
        }
        .sample-wastes { width: 100%; }
        .sample-wastes__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; color: #FFFFFF; }
        .sample-wastes__header h2 { font-size: 1rem; margin: 0; color: #FFFFFF; }
        .sample-wastes__header span { color: rgba(255,255,255,0.84); font-size: 0.75rem; font-weight: 600; }
        .sample-wastes__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
        .sample-waste-card { min-height: 44px; border: 1px solid rgba(255,255,255,0.16); border-radius: var(--radius-lg); background: rgba(255,255,255,0.06); color: #FFFFFF; padding: 8px; cursor: pointer; text-align: left; transition: border-color var(--transition-fast), background var(--transition-fast); }
        .sample-waste-card:hover { border-color: rgba(134,239,172,0.6); background: rgba(255,255,255,0.1); }
        .sample-waste-card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: var(--radius-md); display: block; margin-bottom: 6px; }
        .sample-waste-card__label { display: block; font-size: 0.75rem; font-weight: 700; line-height: 1.25; color: #FFFFFF; }
        .sample-waste-card__category { display: inline-block; margin-top: 6px; font-size: 0.6875rem; font-weight: 700; color: #FFFFFF; background: #15803D; border: 1px solid rgba(134,239,172,0.45); border-radius: 999px; padding: 3px 8px; }

        /* ---- Camera ---- */
        .scan-camera {
          width: 100%;
          max-width: 640px;
          height: 560px;
        }

        /* ---- Preview ---- */
        .scan-preview {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 460px;
        }

        .scan-preview__image-wrapper {
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: #000;
          aspect-ratio: 4/3;
        }

        .scan-preview__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .scan-preview__image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.6));
          padding: 20px 16px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .scan-preview__actions {
          display: flex;
          gap: 12px;
        }

        /* ---- Analyzing ---- */
        .scan-analyzing {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .scan-analyzing__thumbnail {
          width: 100px;
          height: 100px;
          border-radius: var(--radius-xl);
          object-fit: cover;
          border: 3px solid var(--color-primary);
          box-shadow: var(--shadow-green);
        }

        /* ---- Error ---- */
        .scan-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
          padding: 40px;
        }

        .scan-error__title {
          color: white;
          font-size: 1.25rem;
          margin: 0;
        }

        .scan-error__message {
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
          margin: 0;
          max-width: 320px;
        }

        /* ---- Responsive ---- */
        @media (max-width: 1023px) {
          .scan-page {
            grid-template-columns: 280px 1fr;
          }
        }

        @media (max-width: 767px) {
          .scan-page {
            grid-template-columns: 1fr;
            min-height: 0;
          }

          .scan-page__main {
            order: 1;
            padding: 20px 16px;
          }

          .scan-page__sidebar {
            order: 2;
            border-right: none;
            border-top: 1px solid var(--color-border);
            padding: 20px 16px;
          }

          .scan-idle__options {
            grid-template-columns: 1fr;
          }
          .sample-wastes__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }

          .scan-camera {
            height: 440px;
          }
        }
      `}</style>
    </div>
  );
};

export default ScanPage;
