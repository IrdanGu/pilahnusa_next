import { tfHelper } from '../utils/tfHelper.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import HistoryModel from '../models/HistoryModel.js';
import { localFileHandler } from '../localFileHandler.js';
import sharp from 'sharp';
import { validateImageMagicBytes } from '../middleware/upload.js';

// Set to 'graph' for tfjs_graph_model or 'layers' for layers-model

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Class labels
const CLASS_LABELS = {
  0: 'Botol Plastik',
  1: 'Kaca',
  2: 'Kardus dan Kertas',
  3: 'Makanan Sisa',
  4: 'Metal',
  5: 'Pakaian',
  6: 'Plastik',
  7: 'Sisa Buah dan Sayur',
  8: 'Tumbuhan',
  9: 'battery'
};

// Rich data mapping — single source of truth for all waste classes
const CLASS_DATA_MAP = {
  'Botol Plastik': {
    category: 'anorganik',
    description: 'Botol plastik jenis PET (Polyethylene Terephthalate) yang umum digunakan untuk minuman kemasan dan dapat didaur ulang.',
    recyclingPotential: ['Tali', 'Pot tanaman gantung', 'Wadah alat tulis/pernak pernik', 'Toples', 'Sapu', 'Cutting board'],
    disposalGuide: 'Kosongkan isinya, bilas, lepaskan label, dan remas botolnya.',
    environmentalImpact: 'Menjadi mikroplastik yang masuk ke rantai makanan manusia.',
    decompositionTime: '450 Tahun',
    economicValue: 'Tinggi',
    recyclingTips: ['Kosongkan dan bilas sebelum dibuang', 'Pisahkan tutup botol dari badan botol', 'Remas botol untuk hemat ruang', 'Kumpulkan dan jual ke bank sampah'],
    youtubeTutorials: [
      { label: 'Tali', url: 'https://youtu.be/tGRLeQ1LS-E?si=o6InnJFAsJZw_nvP' },
      { label: 'Pot Tanaman', url: 'https://youtube.com/shorts/xelbGICjK-M?si=n-wlxuvsC0TTYaJY' },
      { label: 'Wadah Alat Tulis', url: 'https://youtu.be/RS73u9OFf2I?si=6bfNkfXrNW2Jz3pc' },
      { label: 'Toples', url: 'https://youtu.be/N_H1W739pJU?si=fFMpHAGTaRCoGDKi' },
      { label: 'Sapu', url: 'https://youtu.be/2OeZAS-wJCA?si=c18SNvUq6D2kombe' },
      { label: 'Cutting Board', url: 'https://youtu.be/jx2B55YG4SY?si=LlasYVX7kWAxQTZF' },
    ],
  },
  'Kaca': {
    category: 'anorganik',
    description: 'Pecahan kaca atau botol kaca yang bisa didaur ulang tanpa batas tanpa kehilangan kualitas materialnya.',
    recyclingPotential: ['Toples', 'Kerajinan', 'Wadah', 'Lampu minyak'],
    disposalGuide: 'Pastikan tidak pembuangan. Jika pecah, bungkus dengan koran agar tidak melukai petugas. Rebus botol dalam air mendidih untuk mensterilkan sebelum dipakai ulang.',
    environmentalImpact: 'Melukai hewan dan manusia; tidak bisa hancur secara alami.',
    decompositionTime: 'Selamanya',
    economicValue: 'Sedang',
    recyclingTips: ['Pastikan kaca tidak pecah saat disimpan', 'Bungkus pecahan dengan koran tebal', 'Rebus botol untuk sterilisasi sebelum dipakai ulang', 'Bawa ke bank sampah atau pengepul kaca'],
    youtubeTutorials: [
      { label: 'Toples', url: 'https://youtu.be/pja8HgSC6jU?si=b3vOkRYT--FhFHPU' },
      { label: 'Kerajinan', url: 'https://youtu.be/ZNHpKYy2lBw?si=cMlGJYlDopheL39e' },
      { label: 'Wadah', url: 'https://youtube.com/shorts/KS-g7jLhQQs?si=CgMwmn-LP0TqctKk' },
      { label: 'Lampu Minyak', url: 'https://youtube.com/shorts/CMjAB4uFfYg?si=lUbYhsatUrRAgZYq' },
    ],
  },
  'Kardus dan Kertas': {
    category: 'anorganik',
    description: 'Kertas dan kardus bekas yang mudah didaur ulang dan memiliki nilai ekonomi cukup baik.',
    recyclingPotential: ['Wallpaper dinding', 'Lemari', 'Bahan kerajinan tangan', 'Bungkus gorengan', 'Tote bag'],
    disposalGuide: 'Wajib kering. Lipat/pipihkan untuk menghemat ruang penyimpanan.',
    environmentalImpact: 'Jika basah, kualitas serat rusak dan tidak bisa didaur ulang.',
    decompositionTime: '2-5 Bulan',
    economicValue: 'Tinggi',
    recyclingTips: ['Pastikan kering sebelum disimpan', 'Lipat pipih untuk hemat ruang', 'Lepas selotip dan staples', 'Jual ke pengepul kertas atau bank sampah'],
    youtubeTutorials: [
      { label: 'Wallpaper Dinding', url: 'https://youtu.be/xE0ik8bWc3c?si=jn81gsbWdtBw5vqy' },
      { label: 'Lemari', url: 'https://youtu.be/dNuF2uP86PU?si=bx1MC8maAUsy6d8y' },
      { label: 'Kerajinan Tangan', url: 'https://youtu.be/--jaFz8e-3g?si=srg9Pm_IRt6hsKkK' },
      { label: 'Bungkus Gorengan', url: 'https://youtu.be/RaZf1OTXGEc?si=JbyNdMQC4yut30OE' },
      { label: 'Tote Bag', url: 'https://youtu.be/BgCUD6bxiGU?si=YBYGvIdgMbaXqx7N' },
    ],
  },
  'Makanan Sisa': {
    category: 'organik',
    description: 'Sisa makanan konsumsi yang mudah membusuk dan merupakan bahan baku utama kompos.',
    recyclingPotential: ['Kompos', 'Pakan ternak', 'Bioplastik'],
    disposalGuide: 'Pisahkan dari plastik pembungkus. Jangan biarkan terlalu berair.',
    environmentalImpact: 'Menghasikan gas metana (CH4) yang menyebabkan efek rumah kaca.',
    decompositionTime: '1-4 Minggu',
    economicValue: 'Rendah',
    recyclingTips: ['Pisahkan dari plastik pembungkus', 'Tiriskan air berlebih', 'Jadikan kompos atau pakan ternak'],
    youtubeTutorials: [
      { label: 'Kompos', url: 'https://youtu.be/PkYgN3xfJ2I?si=-Ef6FKhEqyUhzMnj' },
      { label: 'Bioplastik', url: 'https://youtu.be/4RGQzvvMFpc?si=6hdaw8rkGm-tduZc' },
    ],
  },
  'Metal': {
    category: 'anorganik',
    description: 'Kaleng bekas minuman, makanan, atau logam lainnya yang memiliki nilai ekonomi tinggi dan dapat didaur ulang berkali-kali.',
    recyclingPotential: ['Gelas', 'Wadah', 'Celengan', 'Pot', 'Asbak'],
    disposalGuide: 'Bilas sisa makanan/minuman yang menempel dan amplas bagian pinggir yang tajam agar tidak melukai tangan.',
    environmentalImpact: 'Karatnya dapat mencemari unsur hara dalam tanah.',
    decompositionTime: '50-200 Tahun',
    economicValue: 'Tinggi',
    recyclingTips: ['Cuci bersih dan keringkan sebelum dikumpulkan', 'Amplas pinggiran tajam agar aman', 'Pisahkan aluminium dan baja', 'Jual ke pengepul logam'],
    youtubeTutorials: [
      { label: 'Gelas', url: 'https://youtube.com/shorts/AX2l6qVeKcw?si=RgixO6axNQqP_ujv' },
      { label: 'Wadah', url: 'https://youtu.be/MPIOOmnve-8?si=edM7Zxyx64b94lAX' },
      { label: 'Celengan', url: 'https://youtube.com/shorts/sw45qEk_ZnQ?si=ebUWb8s9-p-cq3SE' },
      { label: 'Pot', url: 'https://youtube.com/shorts/G0_KFWwEmuE?si=tKxK7z0BDDYjTxIm' },
      { label: 'Asbak', url: 'https://youtube.com/shorts/XDzgPWdMNu4?si=k-SUK18VSyadxVW1' },
    ],
  },
  'Pakaian': {
    category: 'anorganik',
    description: 'Pakaian bekas, kain, atau produk tekstil lainnya yang dapat didaur ulang menjadi lap, kerajinan tangan, atau serat kain baru.',
    recyclingPotential: ['Lap pembersih', 'Tas belanja (Tote bag)', 'Keset kaki', 'Isian bantal/boneka', 'Kerajinan tangan'],
    disposalGuide: 'Pastikan pakaian dalam kondisi bersih dan kering. Pisahkan pakaian layak pakai untuk didonasikan, dan pakaian rusak untuk didaur ulang.',
    environmentalImpact: 'Serat sintetis (seperti poliester) dapat mencemari lingkungan dengan mikroplastik jika terurai perlahan.',
    decompositionTime: '20-200 Tahun',
    economicValue: 'Sedang',
    recyclingTips: ['Pakaian layak pakai sebaiknya didonasikan', 'Potong pakaian rusak menjadi kain lap untuk menghemat penggunaan tisu', 'Gunakan kain perca untuk kerajinan tangan kreatif'],
    youtubeTutorials: [
      { label: 'Tote Bag dari Baju Bekas', url: 'https://youtu.be/wQc7G81H0B8' },
      { label: 'Keset Kaki dari Kaos', url: 'https://youtu.be/shm_6U0vYfA' }
    ],
  },
  'Plastik': {
    category: 'anorganik',
    description: 'Sampah plastik umum seperti kantong plastik, sedotan, kemasan makanan, atau produk plastik lainnya yang sulit terurai.',
    recyclingPotential: ['Ecobrick', 'Pot tanaman', 'Kerajinan tangan bunga', 'Wadah penyimpanan'],
    disposalGuide: 'Bilas dari sisa makanan/minuman, keringkan, lalu kumpulkan dalam satu wadah khusus sampah plastik.',
    environmentalImpact: 'Plastik tidak dapat hancur secara alami, melainkan terpecah menjadi mikroplastik yang meracuni tanah, air, dan makhluk hidup.',
    decompositionTime: '100-500 Tahun',
    economicValue: 'Sedang',
    recyclingTips: ['Bersihkan sisa makanan agar tidak mengundang bakteri', 'Kurangi penggunaan plastik sekali pakai', 'Buat ecobrick dari potongan plastik kecil'],
    youtubeTutorials: [
      { label: 'Ecobrick', url: 'https://youtube.com/shorts/g7HsT6AJkxE?si=kS8NP8YHSVeoHpCl' },
      { label: 'Kerajinan dari Sedotan', url: 'https://youtu.be/P_rVigD7h-A' }
    ],
  },
  'Sisa Buah dan Sayur': {
    category: 'organik',
    description: 'Sisa buah-buahan dan sayuran dapur yang kaya nutrisi dan sangat baik untuk kompos dan eco-enzyme.',
    recyclingPotential: ['Pupuk Organik Cair', 'Eco-Enzyme'],
    disposalGuide: 'Potong kecil-kecil untuk mempercepat proses pengomposan.',
    environmentalImpact: 'Menimbulkan bau busuk dan mengundang lalat pembawa penyakit.',
    decompositionTime: '2-6 Minggu',
    economicValue: 'Sedang',
    recyclingTips: ['Potong kecil untuk mempercepat pengomposan', 'Buat eco-enzyme dengan rasio 3:1:10', 'Pisahkan dari plastik pembungkus'],
    youtubeTutorials: [
      { label: 'Pupuk Cair', url: 'https://youtu.be/wm5M7K_Snno?si=bmaZw-OTuiW2jRXy' },
      { label: 'Eco-Enzyme', url: 'https://youtube.com/shorts/mRMvz9BgOh4?si=Hf5YtcorAWG5furz' },
    ],
  },
  'Tumbuhan': {
    category: 'organik',
    description: 'Sisa potongan tanaman, daun kering, rumput, atau ranting pohon yang merupakan bahan organik alami.',
    recyclingPotential: ['Kompos', 'Mulsa (pelindung tanah)'],
    disposalGuide: 'Cacah daun atau ranting menjadi bagian kecil agar lebih cepat terurai saat dikomposkan.',
    environmentalImpact: 'Menumpuk menjadi timbulan sampah yang menyumbat saluran air jika dibuang sembarangan.',
    decompositionTime: '1-6 Bulan',
    economicValue: 'Rendah',
    recyclingTips: ['Cacah menjadi bagian kecil untuk mempercepat penguraian', 'Campurkan dengan bahan hijau untuk kompos seimbang', 'Gunakan sebagai mulsa pelindung tanah'],
    youtubeTutorials: [
      { label: 'Kompos Daun Kering', url: 'https://youtu.be/YRHcpHWtf6A?si=JBk3WjW8olL6_yxZ' }
    ],
  },
  'battery': {
    category: 'B3',
    description: 'Baterai bekas yang mengandung bahan kimia berbahaya seperti merkuri, kadmium, dan timbal yang merusak lingkungan.',
    recyclingPotential: ['Tidak ada (Hanya pengumpulan untuk dijual)'],
    disposalGuide: 'Jangan dicampur! Masukkan ke wadah khusus/botol kaca tertutup. Bawa ke pusat pengumpulan limbah B3 terdekat atau drop-point resmi.',
    environmentalImpact: 'Mengandung merkuri dan timbal yang meracuni air tanah.',
    decompositionTime: '100 Tahun+',
    economicValue: 'Sangat Tinggi',
    recyclingTips: ['Jangan dicampur dengan sampah lain', 'Simpan dalam wadah khusus tertutup', 'Bawa ke drop-point atau bank sampah B3'],
    youtubeTutorials: [],
  }
};

// --- Model Loading (Singleton) ---
let model = null;
let modelPromise = null;
let activeExecutions = 0;
const executionQueue = [];

const runWithExecutionQueue = async (task) => {
  if (activeExecutions >= 2) {
    await new Promise((resolve) => executionQueue.push(resolve));
  }
  activeExecutions++;
  try {
    return await task();
  } finally {
    activeExecutions--;
    const next = executionQueue.shift();
    if (next) next();
  }
};

async function loadModel() {
  if (model) return model;
  if (modelPromise) return modelPromise;

  modelPromise = (async () => {
    const modelPath = path.join(__dirname, '../data/tfjs_model/model.json');
    console.log('[AI] Loading TensorFlow.js model from:', modelPath);
    const loadedModel = await tfHelper.loadGraphModel(localFileHandler(modelPath));
    model = loadedModel;
    console.log('[AI] Model loaded and ready.');
    return model;
  })();

  try {
    return await modelPromise;
  } catch (error) {
    modelPromise = null;
    throw error;
  }
}

export const __resetModelForTesting = () => {
  if (model?.dispose) model.dispose();
  model = null;
  modelPromise = null;
};

export const isModelReady = () => Boolean(model);

// Pre-load the model when server starts
loadModel().catch(err => console.error('[AI] Failed to pre-load model:', err));


// --- Image Preprocessing ---
async function preprocessImage(imagePath) {
  // Read file to buffer first to avoid file locking on Windows
  const imageBuffer = fs.readFileSync(imagePath);

  // Use sharp to resize and get raw pixel data (RGB, 224x224)
  const { data, info } = await sharp(imageBuffer, { limitInputPixels: 25_000_000 })
    .resize(224, 224)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Convert to Float32Array and normalize to [0, 1]
  const float32Data = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) {
    float32Data[i] = data[i] / 255.0;
  }

  // Create tensor with shape [1, 224, 224, 3]
  return tfHelper.tensor4d(float32Data, [1, info.height, info.width, info.channels]);
}


// --- Controller ---
export const classifyWaste = async (req, res, next) => {
  const imagePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided for classification' });
    }

    try {
      const fileStats = fs.statSync(imagePath);
      if (!fileStats.isFile() || fileStats.size === 0) {
        return res.status(400).json({ error: 'File bukan gambar JPEG/PNG/WebP yang valid.' });
      }
      const headerBuffer = fs.readFileSync(imagePath).subarray(0, 12);
      const validMagicBytes = await validateImageMagicBytes(headerBuffer);
      if (!validMagicBytes) {
        return res.status(400).json({ error: 'File bukan gambar JPEG/PNG/WebP yang valid.' });
      }
    } catch {
      return res.status(400).json({ error: 'File bukan gambar JPEG/PNG/WebP yang valid.' });
    }

    // Create small thumbnail from the uploaded image for storage efficiency
    let thumbnailBase64 = null;
    try {
      const thumbnailBuffer = await sharp(imagePath, { limitInputPixels: 25_000_000 })
        .resize(200, 200, { fit: 'inside' })
        .jpeg({ quality: 70 })
        .toBuffer();
      thumbnailBase64 = 'data:image/jpeg;base64,' + thumbnailBuffer.toString('base64');
    } catch (err) {
      console.error('[Thumbnail] Failed to create thumbnail:', err);
      // Fallback: we could still proceed without thumbnail or try a simpler way
    }

    // Load model and preprocess image
    const aiModel = await loadModel();
    
    let inputTensor = null;
    let outputTensor = null;
    let probabilities = null;

    try {
      inputTensor = await preprocessImage(imagePath);

      // Run inference - graph models use execute() with named inputs
      const signatureInputs = aiModel.signature?.inputs;
      const inputName = signatureInputs
        ? (Object.keys(signatureInputs)[0] || 'input_layer_2')
        : 'input_layer_2';
      const outputMap = await runWithExecutionQueue(async () => aiModel.execute({ [inputName]: inputTensor }));
      // Output can be a tensor or named map, handle both cases
      outputTensor = Array.isArray(outputMap) ? outputMap[0] : outputMap;
      probabilities = await outputTensor.data();
    } finally {
      // Guaranteed cleanup of tensors to prevent server memory leaks
      if (inputTensor) inputTensor.dispose();
      if (outputTensor) outputTensor.dispose();
    }

    // Find class with highest probability
    let maxProb = -1;
    let classIndex = -1;
    for (let i = 0; i < probabilities.length; i++) {
      if (probabilities[i] > maxProb) {
        maxProb = probabilities[i];
        classIndex = i;
      }
    }

    const predictedLabelName = CLASS_LABELS[classIndex] || 'Unknown';
    const richData = CLASS_DATA_MAP[predictedLabelName] || {};
    const confidence = parseFloat((maxProb * 100).toFixed(2));

    console.log(`[AI] Predicted: ${predictedLabelName} (${confidence}%)`);

    const finalResult = {
      name: predictedLabelName,
      category: richData.category || 'unknown',
      confidence,
      description: richData.description || 'Tidak ada deskripsi',
      recyclingTips: richData.recyclingTips || [],
      recyclingPotential: richData.recyclingPotential || [],
      disposalGuide: richData.disposalGuide || '-',
      environmentalImpact: richData.environmentalImpact || null,
      decompositionTime: richData.decompositionTime || '-',
      economicValue: richData.economicValue || null,
      youtubeTutorials: richData.youtubeTutorials || [],
    };

    // Save to history
    const historyItem = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      imageBase64: thumbnailBase64,
      result: finalResult
    };

    const userId = req.headers?.['x-user-id']?.trim();
    await HistoryModel.add(historyItem, userId || 'anonymous');

    return res.status(200).json(historyItem);

  } catch (error) {
    next(error);
  } finally {
    if (imagePath) {
      try {
        fs.unlink(imagePath, (err) => {
          if (err && err.code !== 'ENOENT') console.error('[Cleanup] Error deleting uploaded file:', err);
        });
      } catch {
        // Temporary files may already have been removed.
      }
    }
  }
};
