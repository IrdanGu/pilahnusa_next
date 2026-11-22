import React, { useRef, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Camera, Share2, Copy, MessageCircle, Bot, LoaderCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import ClassificationResultCard from '../components/result/ClassificationResultCard';
import FeedbackCard from '../components/result/FeedbackCard';
import { getHistoryItemById } from '../utils/storageUtils';
import useHistory from '../hooks/useHistory';
import { useToast } from '../components/ui/Toast';
import { computeItemImpact } from '../utils/ecoCalculations';
import { generateResultShareCard, shareOrDownloadCard, buildWhatsAppShareUrl, copyToClipboard } from '../utils/shareCard';

/**
 * Result page — displays full waste classification results using ClassificationResultCard
 */
const ResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { feedbackSubmitted, submitUserFeedback } = useHistory();
  const { addToast } = useToast();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isSharingCard, setIsSharingCard] = useState(false);
  const headingRef = useRef(null);

  // Get result from navigation state or localStorage fallback
  const stateItem = location.state?.item;
  const stateResult = stateItem?.result || location.state?.result;
  const stateImage = stateItem?.imageBase64 || location.state?.imageDataUrl;
  const historyItem = !stateResult ? getHistoryItemById(id) : null;

  const result   = stateResult || historyItem?.result;
  const imageUrl = stateImage  || historyItem?.imageBase64;
  const item = stateItem || historyItem || { result, imageBase64: imageUrl };
  const impact = computeItemImpact(item?.result || result);

  useEffect(() => {
    headingRef.current?.focus();
  }, [id]);

  useEffect(() => {
    if (location.state?.fromScan && impact.points > 0) {
      addToast(`+${impact.points} Poin Eco!`, 'success', 5000);
    }
  }, [location.state?.fromScan, impact.points, addToast]);

  // Track if user has scrolled to the bottom of the result page
  useEffect(() => {
    if (feedbackSubmitted || !result) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // User has reached close to the bottom (within 80px)
      const reachedBottom = scrollTop + clientHeight >= scrollHeight - 80;
      
      // Screen is tall enough that content fits without scrollbar
      const noScrollbar = scrollHeight <= clientHeight;

      if (reachedBottom || noScrollbar) {
        setHasScrolledToBottom(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    // Secondary delayed check to handle asynchronous rendering/images loading
    const timer = setTimeout(handleScroll, 600);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [feedbackSubmitted, result]);

  // Show feedback form only if general user feedback has not been submitted yet AND scrolled to bottom
  const showFeedback = !feedbackSubmitted && hasScrolledToBottom;

  if (!result) {
    return (
      <div className="result-not-found animate-slide-up">
        <Trash2 size={48} color="var(--color-text-tertiary)" aria-hidden="true" />
        <h1 ref={headingRef} tabIndex="-1">Hasil tidak ditemukan</h1>
        <p>Hasil scan tidak tersedia. Coba scan ulang.</p>
        <Button
          variant="primary"
          icon={<Camera size={16} />}
          onClick={() => navigate('/scan')}
          id="btn-scan-again"
          aria-label="Mulai scan baru"
        >
          Scan Sekarang
        </Button>

        <style>{`
          .result-not-found {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            min-height: 60vh;
            padding: 40px;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  const shareText = `Saya baru saja menscan sampah menggunakan BilahBeu AI!\n${result.name} — Kategori: ${result.category}\nEstimasi dampak: ${impact.co2SavedKg.toFixed(2)} kg CO₂e\n#BilahBeuAI #GoGreen`;

  const handleShareCard = async () => {
    setIsSharingCard(true);
    try {
      const blob = await generateResultShareCard({
        imageBase64: item?.imageBase64 || imageUrl,
        result,
        co2SavedKg: impact.co2SavedKg,
      });
      await shareOrDownloadCard({ blob, filename: 'bilahbeu-hasil-sampah.png', title: 'BilahBeu AI — Hasil Scan', text: shareText });
      addToast('Kartu hasil berhasil dibagikan atau diunduh.', 'success');
    } catch (error) {
      addToast(error.message || 'Gagal membuat kartu hasil.', 'error');
    } finally {
      setIsSharingCard(false);
    }
  };

  const handleCopySummary = async () => {
    const copied = await copyToClipboard(shareText);
    addToast(copied ? 'Ringkasan berhasil disalin.' : 'Ringkasan gagal disalin.', copied ? 'success' : 'error');
  };

  return (
    <div className="result-page animate-slide-up">
      {/* Sticky header */}
      <div className="result-page__header">
        <button
          className="result-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 ref={headingRef} tabIndex="-1" className="result-page__title">Hasil Klasifikasi</h1>
      </div>

      {/* Main scrollable content */}
      <div className="result-content">
        {/* All result sections delegated to ClassificationResultCard */}
        <ClassificationResultCard result={result} imageUrl={imageUrl} />

        {/* Feedback Section (if not submitted yet) */}
        {showFeedback && (
          <FeedbackCard
            onSubmit={submitUserFeedback}
          />
        )}

        {/* Action buttons */}
        <div className="result-actions">
          <button type="button" className="result-action-btn result-action-btn--primary" onClick={handleShareCard} disabled={isSharingCard}>
            {isSharingCard ? <LoaderCircle size={18} className="spin" /> : <Share2 size={18} />}
            Unduh / Bagikan Kartu
          </button>
          <a className="result-action-btn" href={buildWhatsAppShareUrl(shareText)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} /> WhatsApp
          </a>
          <button type="button" className="result-action-btn" onClick={handleCopySummary}>
            <Copy size={18} /> Salin Ringkasan
          </button>
          <button
            type="button"
            className="result-action-btn"
            onClick={() => navigate('/chatbot', { state: { contextItem: {
              name: result?.name,
              category: result?.category,
              confidence: result?.confidence,
              disposalGuide: result?.disposalGuide,
              environmentalImpact: result?.environmentalImpact,
            } } })}
          >
            <Bot size={18} /> Tanya AI tentang Sampah Ini
          </button>
          <button type="button" className="result-action-btn" onClick={() => navigate('/history')}>
            <ArrowLeft size={18} /> Lihat Riwayat
          </button>
          <button type="button" className="result-action-btn" onClick={() => navigate('/scan')}>
            <Camera size={18} /> Scan Lagi
          </button>
        </div>
      </div>

      <style>{`
        .result-page {
          padding: 0 0 24px;
          background: var(--color-bg);
        }

        .result-page__header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          background: var(--color-surface-elevated);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .result-back-btn,
        .result-share-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--color-border);
          background: var(--color-white);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .result-back-btn:hover, .result-share-btn:hover {
          background: var(--color-bg);
          color: var(--color-text-primary);
        }

        .result-page__title {
          flex: 1;
          font-size: 1.0625rem;
          font-weight: 700;
          margin: 0;
          text-align: center;
        }

        .result-content {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 720px;
          margin: 0 auto;
        }

        .result-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding-bottom: 8px;
        }
        .result-action-btn {
          min-height: 44px;
          flex: 1 1 210px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface-elevated);
          color: var(--color-text-primary);
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
        }
        .result-action-btn--primary {
          background: var(--color-primary-btn);
          border-color: var(--color-primary-btn);
          color: white;
        }
        .result-action-btn:disabled { opacity: 0.72; cursor: wait; }
        .result-page__title:focus { outline: none; }
        .spin { animation: spin 1s linear infinite; }

        @media (max-width: 767px) {
          .result-content {
            padding: 16px;
          }
          .result-actions {
            flex-direction: column;
          }
          .result-action-btn { width: 100%; flex-basis: auto; }
        }
      `}</style>
    </div>
  );
};

export default ResultPage;
