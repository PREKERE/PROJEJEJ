# Purple Arcade — Next.js starter

Game arcade dengan koin virtual (tanpa uang asli). Termasuk UI game slot demo, scatter/bonus, dashboard, panel saldo demo, dan riwayat aktivitas sementara.

## Jalankan lokal
1. Install Node.js 20+.
2. Ekstrak ZIP lalu jalankan `npm install`.
3. Jalankan `npm run dev`, buka `http://localhost:3000`.

## Penting tentang keamanan dan database
UI pada starter ini sengaja berstatus **demo lokal**: saldo dan riwayat disimpan dalam state browser dan PIN `2468` bukan autentikasi sungguhan. Jangan deploy panel demo ini sebagai admin publik dan jangan menaruh data rahasia di frontend.

Schema Prisma di `prisma/schema.prisma` adalah fondasi PostgreSQL untuk pengguna dan transaksi. Untuk menjadikannya multi-user production sebelum dipublikasikan:
1. Buat PostgreSQL terkelola (mis. Neon atau Supabase) dan masukkan `DATABASE_URL` ke environment Vercel.
2. Jalankan `npx prisma db push` untuk membuat tabel.
3. Tambahkan autentikasi server-side (mis. Auth.js/Supabase Auth), verifikasi role `ADMIN` pada setiap route handler/server action, validasi input dengan Zod, rate limiting, dan audit log.
4. Implementasikan perubahan saldo dalam transaksi database (`$transaction`) dengan pemeriksaan saldo dan idempotency agar tidak ada saldo negatif atau transaksi ganda.
5. Tetapkan admin lewat migrasi/skrip server yang aman; jangan menerima role admin dari form publik.
6. Deploy ke Vercel dengan repo Git, set environment variables, lalu deploy.

## Game
Hadiah ditentukan oleh hasil reel acak di sisi demo, bukan pengaturan tersembunyi admin. Koin tidak dapat dibeli, ditukar, atau ditarik sebagai uang. Transaksi demo reset saat halaman dimuat ulang.
