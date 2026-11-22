import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, Send, X } from 'lucide-react';
import { useToast } from '../ui/Toast';

const RATING_LABELS = ['1', '2', '3', '4', '5'];

const FeedbackCard = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [hoveredAccuracy, setHoveredAccuracy] = useState(0);
  const [educationEase, setEducationEase] = useState(0);
  const [hoveredEducation, setHoveredEducation] = useState(0);
  const [misdetectedCategories, setMisdetectedCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  const accuracyRefs = useRef([]);
  const educationRefs = useRef([]);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    closeRef.current?.focus();
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus?.();
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const elements = Array.from(focusable).filter((element) => element.offsetParent !== null);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleCategory = (category) => {
    setMisdetectedCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
    );
  };

  const handleRatingKeyDown = (event, value, setValue, refs) => {
    const directions = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (directions.includes(event.key)) {
      event.preventDefault();
      const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
      const next = Math.min(5, Math.max(1, (value || 1) + step));
      setValue(next);
      refs.current[next - 1]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setValue(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return setError('Mohon isi Nama Lengkap Anda.');
    if (!age) return setError('Mohon pilih Kelompok Usia Anda.');
    if (!gender) return setError('Mohon pilih Jenis Kelamin Anda.');
    if (!accuracyRating) return setError('Mohon beri penilaian akurasi AI.');
    if (!educationEase) return setError('Mohon beri penilaian kemudahan informasi edukasi.');

    setIsSubmitting(true);
    setError(null);
    const feedbackMessage = JSON.stringify({
      name: name.trim(), age, gender, accuracyRating, educationEase, misdetectedCategories
    }, null, 2);

    try {
      const { success, error: apiError } = await onSubmit(accuracyRating, feedbackMessage);
      if (success) {
        addToast('Terima kasih! Kuesioner Anda berhasil dikirim.', 'success');
        closeModal();
      } else {
        setError(apiError?.message || 'Gagal mengirim kuesioner. Silakan coba lagi.');
      }
    } catch {
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderRating = (value, setValue, hovered, setHovered, label, refs) => (
    <div
      className="feedback-stars"
      role="radiogroup"
      aria-label={label}
      aria-required="true"
    >
      {RATING_LABELS.map((_, index) => {
        const star = index + 1;
        const isActive = (hovered || value) >= star;
        return (
          <button
            key={star}
            ref={(element) => { refs.current[index] = element; }}
            type="button"
            role="radio"
            aria-checked={value === star}
            tabIndex={value === 0 ? (star === 1 ? 0 : -1) : (value === star ? 0 : -1)}
            className={`feedback-star-btn ${isActive ? 'feedback-star-btn--active' : ''}`}
            onClick={() => setValue(star)}
            onKeyDown={(event) => handleRatingKeyDown(event, star, setValue, refs)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${star} dari 5 bintang`}
          >
            <Star size={32} fill={isActive ? 'var(--color-warning, #F59E0B)' : 'none'} stroke={isActive ? 'var(--color-warning, #F59E0B)' : 'var(--color-text-tertiary)'} />
          </button>
        );
      })}
    </div>
  );

  return createPortal(
    <div
      className="feedback-modal-backdrop animate-fade-in"
      onMouseDown={(event) => event.target === event.currentTarget && closeModal()}
    >
      <div
        ref={dialogRef}
        className="feedback-modal-content animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        tabIndex={-1}
      >
        <button ref={closeRef} type="button" className="feedback-modal-close" onClick={closeModal} aria-label="Tutup kuesioner">
          <X size={20} />
        </button>
        <div className="feedback-header">
          <h3 id="feedback-modal-title" className="feedback-title">Evaluasi Penggunaan BilahBeu AI</h3>
          <p className="feedback-subtitle">Bantu kami meningkatkan kualitas layanan dengan mengisi kuesioner singkat ini.</p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form-container">
          <div className="feedback-scrollable-body">
            <div className="feedback-section-group">
              <h4 className="feedback-section-title">Data Diri Pengguna</h4>
              <div className="feedback-section">
                <label htmlFor="feedback-name" className="feedback-label">Nama Lengkap</label>
                <input id="feedback-name" type="text" className="feedback-input" placeholder="Tulis nama Anda di sini..." value={name} onChange={(event) => setName(event.target.value)} maxLength={100} />
              </div>
              <fieldset className="feedback-section feedback-fieldset">
                <legend className="feedback-label">Pilih Kelompok Usia</legend>
                <div className="feedback-radio-group">
                  {['< 18 tahun', '18 - 25 tahun', '26 - 40 tahun', '> 40 tahun'].map((opt) => (
                    <label key={opt} htmlFor={`feedback-age-${opt}`} className={`feedback-radio-label ${age === opt ? 'active' : ''}`}>
                      <input id={`feedback-age-${opt}`} type="radio" name="age" value={opt} checked={age === opt} onChange={() => setAge(opt)} className="sr-only" />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="feedback-section feedback-fieldset">
                <legend className="feedback-label">Jenis Kelamin</legend>
                <div className="feedback-radio-group">
                  {['Laki-laki', 'Perempuan'].map((opt) => (
                    <label key={opt} htmlFor={`feedback-gender-${opt}`} className={`feedback-radio-label ${gender === opt ? 'active' : ''}`}>
                      <input id={`feedback-gender-${opt}`} type="radio" name="gender" value={opt} checked={gender === opt} onChange={() => setGender(opt)} className="sr-only" />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="feedback-section-group">
              <h4 className="feedback-section-title">Pertanyaan Evaluasi</h4>
              <fieldset className="feedback-section feedback-question feedback-fieldset">
                <legend className="feedback-label">Seberapa akurat AI dalam mendeteksi jenis sampah yang Anda scan?</legend>
                {renderRating(accuracyRating, setAccuracyRating, hoveredAccuracy, setHoveredAccuracy, 'Rating akurasi AI', accuracyRefs)}
                <span className="feedback-label-muted">(1 = Sangat Tidak Akurat, 5 = Sangat Akurat)</span>
              </fieldset>
              <fieldset className="feedback-section feedback-question feedback-fieldset">
                <legend className="feedback-label">Apakah informasi edukasi yang muncul setelah pemindaian mudah Anda pahami?</legend>
                {renderRating(educationEase, setEducationEase, hoveredEducation, setHoveredEducation, 'Rating kemudahan edukasi', educationRefs)}
                <span className="feedback-label-muted">(1 = Sangat Sulit, 5 = Sangat Mudah)</span>
              </fieldset>
              <fieldset className="feedback-section feedback-question feedback-fieldset">
                <legend className="feedback-label">Kategori sampah apa yang paling sering salah dideteksi? (Pilihan ganda, opsional)</legend>
                <div className="feedback-checkbox-group">
                  {['Baterai / Sampah Elektronik', 'Botol / Kemasan Plastik', 'Kaca dan Beling', 'Sisa Makanan / Sayuran', 'Lainnya'].map((opt) => (
                    <label key={opt} htmlFor={`feedback-category-${opt}`} className="feedback-checkbox-label">
                      <input id={`feedback-category-${opt}`} type="checkbox" checked={misdetectedCategories.includes(opt)} onChange={() => toggleCategory(opt)} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
          <div className="feedback-footer">
            {error && <div className="feedback-error-msg" role="alert">{error}</div>}
            <button type="submit" className="feedback-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? <><span className="feedback-spinner" /><span>Mengirim...</span></> : <><Send size={16} /><span>Kirim Tanggapan</span></>}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .feedback-modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,.72); backdrop-filter: blur(8px); display:flex; align-items:center; justify-content:center; z-index:9999999; padding:20px; }
        .feedback-modal-content { background:var(--color-surface-elevated,var(--color-surface)); border-radius:var(--radius-2xl); width:100%; max-width:500px; max-height:90vh; box-shadow:0 25px 50px -12px rgba(0,0,0,.45); position:relative; border:1px solid var(--color-border); display:flex; flex-direction:column; overflow:hidden; }
        .feedback-modal-close { position:absolute; top:12px; right:12px; background:var(--color-bg-secondary); border:1px solid var(--color-border); border-radius:var(--radius-full); width:44px; height:44px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--color-text-primary); z-index:2; }
        .feedback-modal-close:focus-visible,.feedback-star-btn:focus-visible,.feedback-submit-btn:focus-visible { outline:3px solid var(--color-focus,var(--color-primary)); outline-offset:3px; }
        .feedback-header { padding:24px 68px 16px 28px; border-bottom:1px solid var(--color-border); background:var(--color-surface-elevated,var(--color-surface)); }
        .feedback-title { font-size:1.125rem; font-weight:800; margin:0; color:var(--color-text-primary); line-height:1.4; }
        .feedback-subtitle { font-size:.875rem; color:var(--color-text-secondary); margin:6px 0 0; line-height:1.4; }
        .feedback-form-container { display:flex; flex-direction:column; flex:1; overflow:hidden; }
        .feedback-scrollable-body { padding:24px 28px; overflow-y:auto; display:flex; flex-direction:column; gap:28px; }
        .feedback-section-group { display:flex; flex-direction:column; gap:20px; }
        .feedback-section-title { font-size:.8125rem; font-weight:800; text-transform:uppercase; letter-spacing:.5px; color:var(--color-primary-dark,var(--color-primary)); margin:0 0 -8px; }
        .feedback-section { display:flex; flex-direction:column; gap:8px; }
        .feedback-fieldset { border:0; margin:0; min-width:0; padding:0; }
        .feedback-question { background:var(--color-bg-secondary); padding:16px; border:1px solid var(--color-border); border-radius:var(--radius-lg); }
        .feedback-label { font-size:.875rem; font-weight:700; color:var(--color-text-primary); line-height:1.5; }
        .feedback-label-muted { font-size:.75rem; font-weight:500; color:var(--color-text-secondary); text-align:center; margin-top:-4px; }
        .sr-only { position:absolute; width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
        .feedback-input { width:100%; border:1.5px solid var(--color-border); border-radius:var(--radius-lg); padding:12px 14px; font-size:.875rem; color:var(--color-text-primary); background:var(--color-surface); outline:none; }
        .feedback-input:focus { border-color:var(--color-primary); box-shadow:0 0 0 3px var(--color-primary-bg); }
        .feedback-input::placeholder { color:var(--color-text-tertiary); }
        .feedback-radio-group { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:10px; }
        .feedback-radio-label { min-height:44px; display:flex; align-items:center; justify-content:center; padding:10px; border:1.5px solid var(--color-border); border-radius:var(--radius-lg); font-size:.8125rem; font-weight:600; color:var(--color-text-secondary); background:var(--color-surface); cursor:pointer; text-align:center; }
        .feedback-radio-label:hover { background:var(--color-bg-secondary); color:var(--color-text-primary); }
        .feedback-radio-label.active { background:var(--color-primary-bg); border-color:var(--color-primary); color:var(--color-primary-dark,var(--color-primary)); }
        .feedback-stars { display:flex; align-items:center; justify-content:center; gap:4px; margin:8px 0; }
        .feedback-star-btn { width:44px; height:44px; background:transparent; border:0; padding:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-md); }
        .feedback-star-btn:hover { transform:scale(1.1); }
        .feedback-checkbox-group { display:flex; flex-direction:column; gap:8px; margin-top:8px; }
        .feedback-checkbox-label { min-height:44px; display:flex; align-items:center; gap:12px; cursor:pointer; font-size:.875rem; font-weight:500; color:var(--color-text-secondary); padding:4px 0; }
        .feedback-checkbox-label input { width:20px;height:20px;accent-color:var(--color-primary); }
        .feedback-footer { padding:16px 28px 24px; border-top:1px solid var(--color-border); background:var(--color-surface-elevated,var(--color-surface)); display:flex; flex-direction:column; gap:12px; }
        .feedback-error-msg { font-size:.8125rem; font-weight:600; color:var(--color-danger-text,var(--color-text-primary)); background:var(--color-danger-bg,var(--color-bg-secondary)); padding:10px 14px; border-radius:var(--radius-md); border:1px solid var(--color-danger-border,var(--color-border)); text-align:center; }
        .feedback-submit-btn { min-height:48px; display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:14px; border-radius:var(--radius-lg); border:0; font-size:.875rem; font-weight:700; color:var(--color-primary-btn-text,#fff); background:var(--color-primary-btn,var(--color-primary)); cursor:pointer; }
        .feedback-submit-btn:disabled { background:var(--color-bg-secondary); color:var(--color-text-tertiary); cursor:not-allowed; }
        .feedback-spinner { width:18px;height:18px;border:2.5px solid var(--color-border);border-radius:50%;border-top-color:var(--color-primary);animation:feedback-spin .8s linear infinite; }
        @keyframes feedback-spin { to { transform:rotate(360deg); } }
        @media(max-width:640px){ .feedback-modal-backdrop{padding:10px;align-items:flex-end}.feedback-modal-content{max-height:94vh}.feedback-header{padding:20px 64px 14px 20px}.feedback-scrollable-body{padding:20px}.feedback-footer{padding:12px 20px 20px}.feedback-stars{gap:0}.feedback-star-btn{width:44px} }
      `}</style>
    </div>,
    document.body
  );
};

export default FeedbackCard;
