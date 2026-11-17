import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, Send, X } from 'lucide-react';
import { useToast } from '../ui/Toast';

/**
 * FeedbackCard — Form Kuesioner Kepuasan Pengguna for BilahBeu AI
 * Renders via React Portal on document.body to overlay everything including sidebars.
 * @param {function} onSubmit - submitUserFeedback(rating, message) callback from hook
 */
const FeedbackCard = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // State for Demographic
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  
  // State for Questionnaire
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [hoveredAccuracy, setHoveredAccuracy] = useState(0);
  
  const [educationEase, setEducationEase] = useState(0);
  const [hoveredEducation, setHoveredEducation] = useState(0);
  
  const [misdetectedCategories, setMisdetectedCategories] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  // Scroll lock effect: prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleCategory = (category) => {
    if (misdetectedCategories.includes(category)) {
      setMisdetectedCategories(misdetectedCategories.filter(c => c !== category));
    } else {
      setMisdetectedCategories([...misdetectedCategories, category]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError('Mohon isi Nama Lengkap Anda.');
      return;
    }
    if (!age) {
      setError('Mohon pilih Kelompok Usia Anda.');
      return;
    }
    if (!gender) {
      setError('Mohon pilih Jenis Kelamin Anda.');
      return;
    }
    if (accuracyRating === 0) {
      setError('Mohon beri penilaian akurasi AI.');
      return;
    }
    if (educationEase === 0) {
      setError('Mohon beri penilaian kemudahan informasi edukasi.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = {
      name: name.trim(),
      age,
      gender,
      accuracyRating,
      educationEase,
      misdetectedCategories
    };
    
    // Serialize all data into the message field for backend storage
    const feedbackMessage = JSON.stringify(formData, null, 2);

    try {
      const { success, error: apiError } = await onSubmit(accuracyRating, feedbackMessage);
      
      if (success) {
        addToast('Terima kasih! Kuesioner Anda berhasil dikirim.', 'success');
        setIsOpen(false);
      } else {
        setError(apiError?.message || 'Gagal mengirim kuesioner. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="feedback-modal-backdrop animate-fade-in" role="dialog" aria-modal="true">
      <div className="feedback-modal-content animate-scale-in">
        {/* Close Button */}
        <button
          type="button"
          className="feedback-modal-close"
          onClick={() => setIsOpen(false)}
          aria-label="Tutup kuesioner"
        >
          <X size={18} />
        </button>

        <div className="feedback-header">
          <h3 className="feedback-title">Evaluasi Penggunaan BilahBeu AI</h3>
          <p className="feedback-subtitle">
            Bantu kami meningkatkan kualitas layanan dengan mengisi kuesioner singkat ini.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form-container">
          <div className="feedback-scrollable-body">
            
            {/* Demographic Section */}
            <div className="feedback-section-group">
              <h4 className="feedback-section-title">Data Diri Pengguna</h4>
              
              <div className="feedback-section">
                <label className="feedback-label">Nama Lengkap</label>
                <input 
                  type="text" 
                  className="feedback-input" 
                  placeholder="Tulis nama Anda di sini..." 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="feedback-section">
                <label className="feedback-label">Pilih Kelompok Usia</label>
                <div className="feedback-radio-group">
                  {['< 18 tahun', '18 - 25 tahun', '26 - 40 tahun', '> 40 tahun'].map(opt => (
                    <label key={opt} className={`feedback-radio-label ${age === opt ? 'active' : ''}`}>
                      <input type="radio" name="age" value={opt} checked={age === opt} onChange={() => setAge(opt)} className="sr-only" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="feedback-section">
                <label className="feedback-label">Jenis Kelamin</label>
                <div className="feedback-radio-group">
                  {['Laki-laki', 'Perempuan'].map(opt => (
                    <label key={opt} className={`feedback-radio-label ${gender === opt ? 'active' : ''}`}>
                      <input type="radio" name="gender" value={opt} checked={gender === opt} onChange={() => setGender(opt)} className="sr-only" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Questionnaire Section */}
            <div className="feedback-section-group">
              <h4 className="feedback-section-title">Pertanyaan Evaluasi</h4>
              
              <div className="feedback-section feedback-question">
                <label className="feedback-label">Seberapa akurat AI dalam mendeteksi jenis sampah yang Anda scan?</label>
                <div className="feedback-stars-wrapper">
                  <div className="feedback-stars" role="radiogroup" aria-label="Rating Akurasi AI">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = (hoveredAccuracy || accuracyRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          className={`feedback-star-btn ${isActive ? 'feedback-star-btn--active' : ''}`}
                          onClick={() => setAccuracyRating(star)}
                          onMouseEnter={() => setHoveredAccuracy(star)}
                          onMouseLeave={() => setHoveredAccuracy(0)}
                          aria-label={`${star} Bintang`}
                          role="radio"
                          aria-checked={accuracyRating === star}
                        >
                          <Star
                            size={32}
                            fill={isActive ? 'var(--star-active-color, #F59E0B)' : 'none'}
                            stroke={isActive ? 'var(--star-active-color, #F59E0B)' : 'var(--color-text-tertiary)'}
                            className="feedback-star-icon"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <span className="feedback-label-muted">(1 = Sangat Tidak Akurat, 5 = Sangat Akurat)</span>
              </div>

              <div className="feedback-section feedback-question">
                <label className="feedback-label">Apakah informasi edukasi yang muncul setelah pemindaian mudah Anda pahami?</label>
                <div className="feedback-stars-wrapper">
                  <div className="feedback-stars" role="radiogroup" aria-label="Rating Kemudahan Edukasi">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = (hoveredEducation || educationEase) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          className={`feedback-star-btn ${isActive ? 'feedback-star-btn--active' : ''}`}
                          onClick={() => setEducationEase(star)}
                          onMouseEnter={() => setHoveredEducation(star)}
                          onMouseLeave={() => setHoveredEducation(0)}
                          aria-label={`${star} Bintang`}
                          role="radio"
                          aria-checked={educationEase === star}
                        >
                          <Star
                            size={32}
                            fill={isActive ? 'var(--star-active-color, #F59E0B)' : 'none'}
                            stroke={isActive ? 'var(--star-active-color, #F59E0B)' : 'var(--color-text-tertiary)'}
                            className="feedback-star-icon"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <span className="feedback-label-muted">(1 = Sangat Sulit, 5 = Sangat Mudah)</span>
              </div>

              <div className="feedback-section feedback-question">
                <label className="feedback-label">Kategori sampah apa yang menurut Anda paling sering salah dideteksi oleh AI? (Pilihan Ganda - Opsional)</label>
                <div className="feedback-checkbox-group">
                  {[
                    'Baterai / Sampah Elektronik', 
                    'Botol / Kemasan Plastik', 
                    'Kaca dan Beling', 
                    'Sisa Makanan / Sayuran', 
                    'Lainnya'
                  ].map(opt => (
                    <label key={opt} className="feedback-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={misdetectedCategories.includes(opt)} 
                        onChange={() => toggleCategory(opt)} 
                      />
                      <span className="checkbox-text">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="feedback-footer">
            {error && <div className="feedback-error-msg">{error}</div>}
            <button
              type="submit"
              className="feedback-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="feedback-spinner" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Kirim Tanggapan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        /* ---- Modal Backdrop Overlay ---- */
        .feedback-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999999;
          padding: 20px;
        }

        /* ---- Modal Box Content ---- */
        .feedback-modal-content {
          background: var(--color-white);
          border-radius: var(--radius-2xl);
          padding: 0;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          position: relative;
          border: 1px solid var(--color-border-light);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all var(--transition-normal);
        }

        /* ---- Close Button ---- */
        .feedback-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--color-bg-secondary);
          border: none;
          border-radius: var(--radius-full);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-text-secondary);
          transition: all var(--transition-normal);
          z-index: 2;
        }

        .feedback-modal-close:hover {
          background: var(--color-border-light);
          color: var(--color-text-primary);
          transform: rotate(90deg);
        }

        /* ---- Header ---- */
        .feedback-header {
          padding: 24px 28px 16px;
          border-bottom: 1px solid var(--color-border-light);
          background: var(--color-white);
          z-index: 1;
        }

        .feedback-title {
          font-size: 1.125rem;
          font-weight: 800;
          margin: 0;
          color: var(--color-text-primary);
          line-height: 1.4;
          padding-right: 36px;
        }

        .feedback-subtitle {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin: 6px 0 0;
          line-height: 1.4;
        }

        /* ---- Form Body ---- */
        .feedback-form-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        .feedback-scrollable-body {
          padding: 24px 28px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        
        /* Custom scrollbar for better UI */
        .feedback-scrollable-body::-webkit-scrollbar {
          width: 6px;
        }
        .feedback-scrollable-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .feedback-scrollable-body::-webkit-scrollbar-thumb {
          background-color: var(--color-border);
          border-radius: 10px;
        }

        .feedback-section-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feedback-section-title {
          font-size: 0.8125rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--color-primary);
          margin: 0 0 -8px;
        }

        .feedback-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feedback-question {
          background: var(--color-bg-secondary);
          padding: 16px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-light);
        }

        .feedback-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.5;
        }

        .feedback-label-muted {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-text-tertiary);
          text-align: center;
          margin-top: -4px;
        }

        /* ---- Inputs ---- */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .feedback-input {
          width: 100%;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 12px 14px;
          font-size: 0.875rem;
          color: var(--color-text-primary);
          background: var(--color-white);
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .feedback-input:focus {
          border-color: var(--color-primary);
        }

        .feedback-input::placeholder {
          color: var(--color-text-tertiary);
        }

        /* ---- Radio Buttons (Age, Gender) ---- */
        .feedback-radio-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 10px;
        }

        .feedback-radio-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          background: var(--color-white);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: center;
        }

        .feedback-radio-label:hover {
          background: var(--color-bg);
          color: var(--color-text-primary);
        }

        .feedback-radio-label.active {
          background: var(--color-primary-bg);
          border-color: var(--color-primary);
          color: var(--color-primary-darker);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
        }

        /* ---- Star Rating ---- */
        .feedback-stars-wrapper {
          display: flex;
          justify-content: center;
          margin: 8px 0;
        }

        .feedback-stars {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .feedback-star-btn {
          background: transparent;
          border: none;
          padding: 4px;
          cursor: pointer;
          transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          outline: none;
        }

        .feedback-star-btn:hover {
          transform: scale(1.25) rotate(5deg);
        }

        .feedback-star-btn:active {
          transform: scale(0.95);
        }

        .feedback-star-icon {
          transition: all 0.25s ease;
        }

        /* ---- Checkbox Group ---- */
        .feedback-checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .feedback-checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          padding: 4px 0;
        }

        .feedback-checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: var(--color-primary);
          cursor: pointer;
          border-radius: 4px;
        }

        .feedback-checkbox-label:hover {
          color: var(--color-text-primary);
        }

        /* ---- Footer ---- */
        .feedback-footer {
          padding: 16px 28px 24px;
          border-top: 1px solid var(--color-border-light);
          background: var(--color-white);
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 1;
        }

        /* ---- Error message ---- */
        .feedback-error-msg {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-b3);
          background: var(--color-b3-bg);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(239, 68, 68, 0.2);
          text-align: center;
        }

        /* ---- Submit Button ---- */
        .feedback-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px;
          border-radius: var(--radius-lg);
          border: none;
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          box-shadow: var(--shadow-green);
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .feedback-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-green-lg);
        }

        .feedback-submit-btn:disabled {
          background: var(--color-bg-secondary);
          color: var(--color-text-tertiary);
          box-shadow: none;
          cursor: not-allowed;
        }

        /* ---- Spinner ---- */
        .feedback-spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default FeedbackCard;
