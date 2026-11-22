export const CHATBOT_FALLBACK_ENTRIES = [
  { keywords:['organik','kulit','sisa makanan','buah'], answer:'Sampah organik basah dapat dikumpulkan terpisah untuk kompos, eco-enzyme, atau diberikan ke pengelola takakura. Keringkan sampah organik yang berair agar tidak berbau dan hindari mencampurnya dengan B3.' },
  { keywords:['kompos','takakura','bokashi'], answer:'Untuk kompos rumah: campurkan sisa hijau (kulit buah/sayur) dengan material cokelat (daun kering/kertas), aduk berkala, jaga lembap seperti spons diperas, dan hindari daging, minyak, serta kotoran hewan peliharaan.' },
  { keywords:['eco-enzyme','enzim'], answer:'Eco-enzyme dibuat dari gula, sisa buah/sayur organik, dan air dengan rasio umum 1:3:10. Tutup wadah longgar, keluar gas setiap hari awal pembuatan, hindari wadah tertutup rapat, dan simpan di lokasi aman.' },
  { keywords:['plastik','pet','botol'], answer:'PET umumnya dari botol minuman bening. Kosongkan, bilas singkat, tutup terpasang atau terpisah sesuai bank sampah, pipihkan, dan serahkan ke pemulung/bank sampah.' },
  { keywords:['hdpe','detergen','shampoo'], answer:'HDPE mudah dikenali pada botol susu, deterjen, atau shampoo. Bilas dan keringkan; pisahkan tutup dan label bila diminta bank sampah setempat.' },
  { keywords:['pp','polypropylene','gelas plastik'], answer:'PP biasanya berlogo angka 5 pada tutup, wadah makanan, atau sedotan. Bilas sisa minyak/makanan, keringkan, dan setorkan bila lokasi menerima.' },
  { keywords:['kresek','kantong','styrofoam','polystyrene'], answer:'Kresek dan styrofoam sering sulit didaur ulang. Kurangi penggunaannya, gunakan wadah kain/isi ulang, dan cari bank sampah khusus. Jangan dibakar.' },
  { keywords:['kaca','botol kaca','pecahan'], answer:'Kaca dapat didaur ulang. Kemas pecahan dengan aman dalam kardus berlabel “Hati-hati”, jauhkan dari anak, dan serahkan ke pengumpul kaca atau bank sampah.' },
  { keywords:['kaleng','logam','aluminium','besi'], answer:'Kaleng/logam boleh dibilas dan dikeringkan. Tekuk hanya jika aman; kumpulkan secara terpisah agar volume berkurang dan mudah dijual.' },
  { keywords:['kertas','kardus','karton'], answer:'Kertas dan kardus kering dapat dijual atau didaur ulang. Lepaskan plastik/tape berlebih, lipat kardus, dan jangan gunakan kertas berminyak atau tercampur makanan.' },
  { keywords:['baterai','aki'], answer:'JANGAN dibuang ke sampah biasa atau dibakar. Baterai bekas mengandung bahan berbahaya. Simpan kering dalam wadah terpisah dan serahkan ke drop-point B3 atau layanan koleksi resmi.' },
  { keywords:['lampu','neon','fluorescent','merkuri'], answer:'Lampu neon mengandung merkuri. Jangan pecahkan; bungkus utuh dalam kemasannya bila memungkinkan dan serahkan ke titik koleksi B3.' },
  { keywords:['obat','kedaluwarsa','madu obat','farmasi'], answer:'Obat kedaluwarsa harus diserahkan ke apotek atau fasilitas penerima obat B3. JANGAN dibuang ke toilet karena mencemari air, dan jangan dibakar.' },
  { keywords:['e-waste','elektronik','hp','handphone','kabel'], answer:'Perangkat elektronik/B3 e-waste tetap mengandung logam dan bahan berbahaya. Lepaskan baterai bila aman, lindungi data, dan bawa ke pengumpul e-waste resmi.' },
  { keywords:['minyak','jelantah','goreng'], answer:'Jangan buang minyak jelantah ke wastafel atau tanah. Dingin dan saring, simpan rapat, lalu serahkan ke penadah bahan baku biodiesel atau bank minyak jelantah.' },
  { keywords:['bank sampah','setor','tabungan sampah'], answer:'Pisahkan dan bersihkan sampah bernilai, timbang sesuai aturan bank sampah terdekat, lalu sertakan identitas untuk pencatatan/penjualan.' },
  { keywords:['3r','reduce','reuse','recycle','kurangi','pakai ulang','daur ulang'], answer:'Utamakan 3R: kurangi pembelian sekali pakai, gunakan ulang wadah, lalu daur ulang material yang telah bersih dan diterima fasilitas setempat.' },
  { keywords:['daftar','tips','harian','rutinitas','cara'], answer:'Rutinitas harian: bawa wadah sendiri, pisahkan satu ember organik dan satu wadah kering, bersihkan sebelum setorkan, simpan B3 terpisah, dan cek jadwal pengangkutan.' },
  { keywords:['bilahbeu','aplikasi','fitur','scan','ai'], answer:'BilahBeu AI membantu pemindaian sampah, penjelasan pembuangannya, riwayat, kuis, dampak eco, bank sampah, dan kartu berbagi dampak. Hasil AI adalah panduan awal—jika ragu, gunakan aturan bank sampah setempat.' },
  { keywords:['bom','api','bakar','insinerasi'], answer:'Jangan membakar sampah di lingkungan terbuka. Asap membahayakan kesehatan dan mencemari udara; hubungi layanan pengelolaan atau bank sampah setempat.' },
  { keywords:['bau','lalat','rusak','busuk'], answer:'Pisahkan bahan organik segera, tutup wadah rapat, bersihkan dengan sabun, gunakan cacing/takakura/kompos bila aman, dan buang air cucian ke saluran yang tepat.' },
  { keywords:['cukong','magnet','pilah'], answer:'Tidak semua sampah bernilai sama. Gunakan magnet/cara visual untuk memisahkan logam dari kaca/kertas hanya bila aman; jangan memecah B3.' },
  { keywords:['kantong plastik','single use','sekali pakai'], answer:'Ganti kantong sekali pakai dengan tas kain, isi ulang botol, dan pilih kemasan besar/minimal. Pastikan plastik bekas bersih sebelum dikumpulkan.' },
  { keywords:['residu','sisa','campur'], answer:'Sampah residu yang tidak bisa dipilah atau didaur ulang sebaiknya dibungkus rapat sesuai jadwal pengangkutan agar tidak tercecer atau mencemari sampah lain.' },
  { keywords:['masker','tisu','popok','diapers'], answer:'Masker bekas, tisu, dan popok umumnya masuk residu karena tercemar. Bungkus rapat dan buang pada jadwal pengumpulan; masker APD medis ikuti aturan fasilitas kesehatan.' },
  { keywords:['vape','rokok','lighter','pemantik'], answer:'Isi vape, puntung rokok, korek api bekas dapat berisiko terbakar atau beracun. Jauhkan dari api, biarkan dingin, dan serahkan ke layanan limbah berbahaya bila tersedia.' },
  { keywords:['cat','thinner','pelapis','bahan kimia'], answer:'Cat dan thinner adalah B3. Jangan dibuang ke got. Biarkan residu mengering dalam wadah semula hanya jika aman, tutup rapat, dan serahkan ke fasilitas B3.' },
  { keywords:['pestisida','insektisida','herbisida'], answer:'Kemasan pestisida tetap berbahaya meski kosong. Jangan dicuci ke tanah/selokan; kembalikan wadah dan obat ke titik penerima B3 atau otoritas setempat.' },
  { keywords:['roti','nasi','makanan'], answer:'Sisa makanan yang masih layak sebaiknya dimakan atau disumbangkan kepada lembaga aman. Sisanya dapat dikomposkan; hindari campuran minyak berlebih dan daging mentah.' },
  { keywords:['daun','ranting','kebun'], answer:'Daun dan ranting dapat dikeringkan sebagai mulsa atau dikomposkan. Ranting besar potong aman, dan jangan dibakar.' },
  { keywords:['tetrapack','karton minuman','aseptik'], answer:'Kemasan aseptik berlapis kertas-plastik-aluminium. Bilas, keringkan, pipihkan, dan cari titik khusus karena penanganannya tidak tersedia di semua bank sampah.' },
  { keywords:['bubble wrap','kemasan','plastik udara'], answer:'Bubble wrap dan plastik kemasan dapat dikumpulkan bila diterima pengumpul khusus. Kurangi volume dan hindari mencampur dengan sedotan/puding.' },
  { keywords:['sampah medis','jarum','syringe'], answer:'Jarum dan alat medis tajam adalah limbah berbahaya. Jangan dibuang ke tempat sampah biasa; gunakan wadah tajam tertutup dan serahkan ke fasilitas kesehatan.' },
  { keywords:['sampo sachet','sachet','bungkus'], answer:'Sachet multi-lapisan sulit didaur ulang. Minimalkan pembelian, pilih kemasan isi ulang, dan gunakan program drop-off bila tersedia.' },
  { keywords:['b3','limbah berbahaya'], answer:'Waspada B3: baterai, lampu neon, obat kedaluwarsa, minyak berbahaya, cat, pestisida, dan elektronik. Kemas terpisah, jangan pecah/diolah sendiri, dan gunakan titik penerima resmi.' },
  { keywords:['aman','keamanan','mencuci','cuci'], answer:'Untuk sampah umum, gunakan sarung tangan, bilas dari jauh agar tidak terhirup, keringkan, dan jangan mencium/meraba bahan kimia. Jika tercemar tumpahan B3, hubungi petugas lingkungan.' },
];

const contextAnswer = (item) => {
  const name = item?.name || item?.result?.name || 'benda ini';
  const category = item?.category || item?.result?.category || 'tidak diketahui';
  if (category === 'B3') {
    return `${name} tergolong B3. Utamakan keselamatan: jangan dibakar, dibongkar, atau dipatahkan. Simpan dalam wadah kering dan tertutup, jauhkan dari anak/hewan, lalu serahkan ke titik penerima B3 atau bank sampah yang melayani limbah berbahaya.`;
  }
  if (category === 'Organik') {
    return `${name} tergolong organik. Pisahkan dari B3 dan kemasan berbahaya, buang bahan berair/kimia, lalu komposkan atau serahkan sebagai sisa organik. Hindari daging mentah atau minyak berlebih untuk kompos rumah sederhana.`;
  }
  if (category === 'Anorganik') {
    return `${name} tergolong anorganik. Kosongkan, bilas bila kotor, keringkan, dan kelompokan dengan material sejenis. Lepaskan bahan berbahaya, lalu serahkan ke pemulung atau bank sampah; hindari membakar.`;
  }
  return `${name} belum dapat dipastikan kategorinya. Pilah secara visual: organik untuk sisa dapur/tumbuhan, anorganik untuk kering bernilai, dan B3 untuk baterai/lampu/obat/kimia. Jika ragu, jangan dibakar atau dibuang ke got; tanyakan bank sampah setempat.`;
};

export const getOfflineAnswer = (message, contextItem) => {
  if (contextItem) {
    const text = `${message || ''} ${contextItem?.name || contextItem?.result?.name || ''}`.toLowerCase();
    const relevantTerms = ['ini','bagaimana','buang','pilah','aman','bank','daur','b3','sampah','dipilah','disetor'];
    if (relevantTerms.some((term) => text.includes(term))) return contextAnswer(contextItem);
  }

  const words = String(message || '').toLowerCase().match(/[a-z0-9]+|[a-z]+/gi) || [];
  let best = null;
  let bestScore = 0;
  CHATBOT_FALLBACK_ENTRIES.forEach((entry) => {
    const score = entry.keywords.reduce((total, keyword) => total + (words.some((word) => word.includes(keyword) || keyword.includes(word)) ? 2 : String(message || '').toLowerCase().includes(keyword) ? 4 : 0), 0);
    if (score > bestScore) { bestScore = score; best = entry; }
  });
  if (best && bestScore > 0) return best.answer;
  return 'BilahBeu AI dapat membantu pilah organik, anorganik, dan B3. Contoh topik: kompos, eco-enzyme, PET/HDPE/PP/kresek, kaca, kaleng, kertas, baterai, lampu neon, obat kedaluwarsa, minyak jelantah, bank sampah, dan tips 3R. Untuk panduan pembuangan yang aman, buka menu Panduan atau cari bank sampah terdekat.';
};
