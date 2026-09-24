# Desain Fitur Pencarian Bank Sampah Terdekat

## Ringkasan

PilahNusa AI akan memiliki halaman khusus untuk menemukan bank sampah terdekat berdasarkan lokasi perangkat pengguna. MVP menggunakan dataset statis internal aplikasi, menampilkan hasil sebagai daftar yang diurutkan berdasarkan jarak, dan menyediakan tombol untuk membuka rute Google Maps.

## Tujuan dan Batasan

### Tujuan

- Membantu pengguna menemukan bank sampah yang paling dekat.
- Menampilkan informasi yang cukup untuk memilih lokasi sebelum berangkat.
- Membuka navigasi eksternal tanpa membangun sistem peta sendiri.
- Menangani izin lokasi dan kegagalan geolocation secara eksplisit.

### Di luar ruang lingkup MVP

- Sinkronisasi data bank sampah dari server atau Supabase.
- Peta interaktif atau marker di dalam aplikasi.
- Pencarian alamat manual sebagai fallback.
- Verifikasi real-time status operasional bank sampah.

## Arsitektur

Tambahkan route `/bank-sampah` dan halaman `WasteBankPage`. Halaman diakses melalui item “Bank Sampah” pada sidebar desktop dan bottom navigation mobile.

Data lokasi disimpan di `src/data/wasteBanks.js` sebagai array terstruktur. Setiap entri memiliki:

- `id`
- `name`
- `address`
- `latitude`
- `longitude`
- `operatingStatus`
- `operatingHours`
- `acceptedMaterials`

Logika perhitungan jarak dan pengurutan dipisahkan dari komponen UI agar dapat diuji secara unit. Jarak dihitung menggunakan rumus Haversine berdasarkan koordinat pengguna dan koordinat bank sampah, lalu hasil diurutkan dari jarak terkecil ke terbesar.

## Alur Data

1. Pengguna membuka `/bank-sampah`.
2. Halaman meminta izin geolocation browser.
3. Saat permintaan berlangsung, halaman menampilkan state loading.
4. Jika berhasil, koordinat pengguna dipakai untuk menghitung jarak seluruh entri data statis.
5. Hasil diurutkan ascending dan ditampilkan sebagai kartu.
6. Tombol “Lihat rute” membuka Google Maps Directions di tab baru menggunakan koordinat tujuan.
7. Jika izin ditolak atau geolocation gagal, halaman menampilkan pesan yang jelas dan tombol “Coba lagi”. Hasil tidak ditampilkan dengan jarak yang tidak valid.

## Desain UI

Halaman menampilkan:

- Judul dan penjelasan singkat.
- Ringkasan bahwa lokasi perangkat sedang digunakan.
- Tombol “Gunakan lokasi saya” untuk meminta ulang lokasi.
- Daftar kartu bank sampah terdekat.

Setiap kartu menampilkan nama, jarak dalam kilometer, alamat, status buka/tutup, jam operasional, material yang diterima, dan tombol “Lihat rute”.

State wajib:

- `loading`: permintaan lokasi sedang berlangsung.
- `success`: daftar terurut tersedia.
- `error`: izin ditolak, posisi tidak tersedia, atau timeout; tampilkan pesan dan aksi mencoba lagi.
- `empty`: dataset tidak memiliki lokasi; tampilkan pesan kosong yang informatif.

## Google Maps

URL rute dibuat menggunakan koordinat tujuan dan dibuka dengan `window.open(..., '_blank', 'noopener,noreferrer')` atau pola aman yang setara. Tidak ada API key atau integrasi SDK peta pada MVP.

## Testing

- Unit test helper Haversine untuk jarak nol, jarak valid, dan urutan ascending.
- Component test untuk state loading, success, error, retry, dan pembuatan tautan Google Maps.
- E2E test untuk membuka route Bank Sampah dan memverifikasi halaman dapat dirender.
- Geolocation browser dimock pada test agar suite deterministik.

## Dokumentasi

README diperbarui untuk menjelaskan fitur baru, kebutuhan izin lokasi browser, fallback ketika izin ditolak, dan bahwa data bank sampah masih dikelola statis di sisi frontend pada MVP.

## Kriteria Keberhasilan

- Item navigasi desktop dan mobile membuka `/bank-sampah`.
- Setelah izin lokasi diberikan, kartu tampil dalam urutan jarak terdekat.
- Setiap kartu menampilkan informasi operasional dan material yang diterima.
- Tombol rute membuka Google Maps dengan tujuan yang benar.
- Penolakan izin tidak menyebabkan error tak tertangani atau jarak palsu.
- Test terkait fitur lulus tanpa bergantung pada lokasi perangkat nyata.
