# Menonaktifkan Akses Tim Pengembang dan Menghapus Identitas Tim dari README

## Tujuan

Menonaktifkan seluruh akses publik ke halaman Tim Pengembang dan menghapus nama anggota serta nama kelompok pengembang dari README, tanpa mengubah navigasi aplikasi lainnya.

## Desain

### Navigasi dan routing

- Hapus item `Tim Pengembang` dari navigasi desktop di `src/components/layout/Sidebar.jsx`.
- Pertahankan `src/components/layout/BottomNav.jsx` beserta semua menu mobile yang sudah ada. Komponen ini tidak memiliki item Tim Pengembang.
- Hapus tombol floating mobile yang mengarah ke `/team` dari `src/components/layout/Layout.jsx`.
- Hapus import `TeamPage` dan route `/team` dari `src/App.jsx`, sehingga halaman tidak dapat diakses melalui URL langsung.
- Hapus `src/pages/TeamPage.jsx` dan aset foto profil tim yang hanya digunakan halaman tersebut.

### README

- Hapus seluruh bagian `Tim Pengembang`, termasuk nama, ID, learning path, dan universitas.
- Ubah penyebutan `tim Data Scientist` menjadi deskripsi netral tanpa nama kelompok.
- Pertahankan istilah teknis umum seperti Machine Learning dan AI Chatbot.

## Validasi

- Cari ulang source dan README untuk memastikan tidak ada referensi navigasi, route, atau identitas tim yang tersisa.
- Jalankan lint dan test yang tersedia untuk memastikan perubahan tidak merusak aplikasi.

## Batasan

Perubahan ini tidak menghapus navbar bawah mobile secara keseluruhan dan tidak mengubah menu Beranda, Riwayat, Chatbot, Bank Sampah, atau Panduan.
