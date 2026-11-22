const WIDTH = 1080;
const HEIGHT = 1350;

const roundedRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
  ctx.fill();
};

const loadImage = (source) => new Promise((resolve, reject) => {
  if (!source) { resolve(null); return; }
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error('Gagal memuat gambar untuk kartu.'));
  image.src = source;
});

const createCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  return canvas;
};

const canvasToPngBlob = (canvas) => new Promise((resolve, reject) => {
  if (canvas.toBlob) canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Gagal membuat kartu PNG.')), 'image/png', 1);
  else resolve(new Blob([canvas.toDataURL('image/png').split(',')[1]], { type: 'image/png' }));
});

const drawBase = (ctx) => {
  ctx.fillStyle = '#F4F7EF'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#173F35'; ctx.fillRect(0, 0, WIDTH, 170);
  ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 54px system-ui, sans-serif';
  ctx.fillText('BilahBeu AI', 70, 105);
  ctx.fillStyle = '#A7D6A5'; ctx.font = '28px system-ui, sans-serif';
  ctx.fillText('Pilah cerdas, bumi lebih hijau', 72, 145);
};

export const generateResultShareCard = async ({ imageBase64, result, co2SavedKg = 0 }) => {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');
  drawBase(ctx);
  ctx.fillStyle = '#FFFFFF';
  roundedRect(ctx, 70, 220, 940, 860, 36);
  if (imageBase64) {
    try {
      const image = await loadImage(imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`);
      if (image) ctx.drawImage(image, 110, 260, 860, 560);
    } catch (error) { console.error('Gagal menggambar gambar kartu:', error); }
  }
  ctx.fillStyle = '#173F35'; ctx.font = 'bold 58px system-ui, sans-serif';
  ctx.fillText(result?.name || 'Hasil Pemilahan', 110, 900);
  ctx.fillStyle = '#4F665F'; ctx.font = '34px system-ui, sans-serif';
  ctx.fillText(`Kategori: ${result?.category || 'Tidak diketahui'}`, 110, 966);
  ctx.fillStyle = '#2E7D32'; ctx.font = 'bold 38px system-ui, sans-serif';
  ctx.fillText(`Dampak estimasi: ${Number(co2SavedKg || 0).toFixed(2)} kg CO2e`, 110, 1030);
  ctx.fillStyle = '#173F35'; ctx.font = '28px system-ui, sans-serif';
  ctx.fillText('Dampak adalah perkiraan CO2e per item.', 70, 1250);
  ctx.fillText('bilahbeu.ai', 70, 1300);
  return canvasToPngBlob(canvas);
};

export const generateImpactShareCard = async ({ levelName, totalScans = 0, totalPoints = 0, co2SavedKg = 0, streak = 0, unlockedBadges = [] }) => {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');
  drawBase(ctx);
  ctx.fillStyle = '#FFFFFF'; roundedRect(ctx, 70, 220, 940, 940, 36);
  ctx.fillStyle = '#173F35'; ctx.font = 'bold 46px system-ui, sans-serif';
  ctx.fillText('Perjalanan Eco Saya', 110, 300);
  ctx.fillStyle = '#2E7D32'; ctx.font = 'bold 72px system-ui, sans-serif';
  ctx.fillText(levelName || 'Kecambah', 110, 420);
  const stats = [
    [`${totalScans}`, 'Scan'],
    [`${totalPoints}`, 'Eco Points'],
    [`${Number(co2SavedKg || 0).toFixed(2)} kg`, 'CO2e dihemat'],
    [`${streak}`, 'Hari streak'],
  ];
  stats.forEach((stat, index) => {
    const x = index % 2 === 0 ? 110 : 570;
    const y = 560 + Math.floor(index / 2) * 220;
    ctx.fillStyle = '#EEF6E9'; roundedRect(ctx, x, y - 90, 400, 160, 24);
    ctx.fillStyle = '#173F35'; ctx.font = 'bold 46px system-ui, sans-serif'; ctx.fillText(stat[0], x + 30, y - 28);
    ctx.fillStyle = '#4F665F'; ctx.font = '28px system-ui, sans-serif'; ctx.fillText(stat[1], x + 30, y + 25);
  });
  ctx.fillStyle = '#173F35'; ctx.font = '34px system-ui, sans-serif';
  ctx.fillText(`Badge terbuka: ${Array.isArray(unlockedBadges) ? unlockedBadges.length : 0}/8`, 110, 1040);
  ctx.fillStyle = '#4F665F'; ctx.font = '28px system-ui, sans-serif';
  ctx.fillText('Pilah cerdas, bumi lebih hijau.', 110, 1120);
  return canvasToPngBlob(canvas);
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const shareOrDownloadCard = async ({ blob, filename = 'bilahbeu-card.png', title = 'BilahBeu AI', text = '' }) => {
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], filename, { type: blob.type || 'image/png' });
    if (navigator.canShare({ files: [file] })) return navigator.share({ title, text, files: [file] });
  }
  downloadBlob(blob, filename);
  return null;
};

export const buildWhatsAppShareUrl = (text) => `https://wa.me/?text=${encodeURIComponent(text || '')}`;

export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true; }
  } catch (error) { console.error('Clipboard API tidak tersedia:', error); }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text; textarea.style.position = 'fixed'; textarea.style.opacity = '0';
    document.body.appendChild(textarea); textarea.select();
    const copied = document.execCommand('copy'); textarea.remove();
    return copied;
  } catch { return false; }
};
