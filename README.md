# Papan Pesan — On-chain Message Board (Solana)

Boilerplate untuk live-coding kelas pemula. Sebuah "papan pesan" sederhana:
setiap wallet menyimpan **satu** pesan di akun PDA miliknya sendiri, dan pesannya
bisa dibaca kembali langsung dari client.

- **Program (on-chain):** Anchor 0.31 / Rust, deploy ke **devnet**.
- **Frontend:** React + Vite + TypeScript, `@solana/wallet-adapter` (Phantom),
  `@coral-xyz/anchor`.

> Scaffold ini **lengkap dan bisa jalan**, KECUALI dua bagian inti yang ditulis
> oleh instruktur saat live coding (lihat [Dua titik live-coding](#dua-titik-live-coding)).
> Solusi lengkapnya ada di folder [`solution/`](./solution).

---

## Struktur folder

```
boilerplate/
├── Anchor.toml                      # cluster = devnet
├── Cargo.toml                       # workspace Rust
├── package.json                     # deps untuk test Anchor (mocha/chai)
├── tsconfig.json
├── programs/
│   └── papan-pesan/
│       ├── Cargo.toml               # anchor-lang + fitur "init-if-needed"
│       └── src/lib.rs               # ⭐ LIVE: badan store_data
├── tests/
│   └── papan-pesan.ts               # store lalu fetch (mocha)
├── migrations/deploy.ts
├── app/                             # frontend React + Vite
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx                 # Buffer shim + render
│       ├── WalletProviders.tsx      # Phantom + devnet
│       ├── anchorClient.ts          # new Program(idl, provider)
│       ├── idl/papan_pesan.json     # placeholder IDL (timpa setelah anchor build)
│       └── App.tsx                  # ⭐ LIVE: storeData() & getData()
└── solution/                        # jawaban lengkap (referensi anti-stuck)
    ├── lib.rs
    └── App.tsx
```

---

## Prasyarat

- Rust + Solana CLI + Anchor (`avm`) — Anchor `0.31.x`.
- Node 18+ dan `yarn` (atau `npm`).
- Wallet **Phantom** di browser, di-set ke **Devnet**.

---

## 1) Setup & deploy program (devnet)

Jalankan dari folder `boilerplate/`:

```bash
# arahkan CLI ke devnet
solana config set --url devnet

# pastikan ada SOL untuk biaya deploy (ulangi jika perlu)
solana airdrop 2

# build pertama — membuat keypair program di target/deploy
anchor build

# sinkronkan Program ID ke declare_id!() + Anchor.toml
anchor keys sync

# build LAGI supaya biner memuat Program ID yang baru
anchor build

# deploy ke devnet
anchor deploy
```

> **Kenapa build dua kali?** `anchor keys sync` mengganti Program ID di
> `declare_id!()` dan `Anchor.toml` agar cocok dengan keypair yang baru dibuat.
> Build pertama membuat keypair-nya; build kedua mengompilasi ulang dengan ID
> yang benar. Tanpa ini, transaksi akan ditolak (`DeclaredProgramIdMismatch`).

### Jalankan test

```bash
yarn install        # sekali saja
anchor test --skip-local-validator    # devnet; atau `anchor test` untuk localnet
```

Test akan **store** lalu **fetch** sebuah pesan dan memastikan isinya cocok.

---

## 2) Hubungkan frontend ke program

Setelah `anchor build`, Anchor menulis IDL ke `target/idl/papan_pesan.json`.

```bash
# salin IDL hasil build ke frontend (timpa placeholder)
cp target/idl/papan_pesan.json app/src/idl/papan_pesan.json
```

- IDL Anchor 0.30+ sudah memuat **Program ID** di field `address`, jadi
  `app/src/anchorClient.ts` tidak perlu diubah — cukup file IDL-nya yang baru.
- Kalau kamu pernah `anchor keys sync`, pastikan `address` di IDL = Program ID
  hasil deploy. Menyalin ulang IDL dari `target/idl` sudah menjamin ini.

### Jalankan frontend

```bash
cd app
yarn install
yarn dev
```

Buka URL yang ditampilkan Vite, **Connect** Phantom (mode Devnet), tulis pesan,
klik **Kirim**, lalu **Muat pesan tersimpan**.

---

## Dua titik live-coding

Scaffold sengaja menyisakan **dua** bagian inti untuk ditulis di depan kelas.
Keduanya ditandai `// TODO (live): ...` dan punya **solusi di komentar tepat di
sebelahnya**, plus salinan di `solution/`.

| # | File | Fungsi | Yang ditulis live |
|---|------|--------|-------------------|
| 1 | `programs/papan-pesan/src/lib.rs` | `store_data` | `papan.penulis = user.key(); papan.pesan = pesan; Ok(())` |
| 2 | `app/src/App.tsx` | `storeData()` + `getData()` | `.storeData(input).accountsPartial({ user }).rpc()` dan `program.account.papan.fetch(pda)` |

Referensi solusi:
- Program → [`solution/lib.rs`](./solution/lib.rs)
- Client → [`solution/App.tsx`](./solution/App.tsx)

Sebelum diisi, scaffold sengaja melempar error yang jelas (program: `todo!()`,
client: `throw new Error(...)`) supaya tidak ada perilaku "diam-diam salah".

---

## Catatan penting (sudah ditinjau)

- **Membaca data = gratis, tanpa instruksi on-chain.** Tidak ada `get_data` di
  program. Client menghitung ulang PDA lalu `program.account.papan.fetch(pda)`.
- **`init_if_needed`** dipakai supaya kirim ulang akan **menimpa** pesan lama
  (enak untuk demo). Fitur `init-if-needed` **wajib** ditambahkan di
  `programs/papan-pesan/Cargo.toml` (sudah ada).
- **`space = 8 + 32 + 4 + 200`** menghitung **byte**:
  `8` discriminator + `32` Pubkey + `4` panjang String + `200` budget isi pesan.
  Ingat: **emoji = 4 byte**, huruf latin = 1 byte. Jadi "200" itu 200 byte,
  bukan 200 karakter.
- Di client **selalu** pakai `.accountsPartial({ user })`, **bukan** `.accounts`
  (typing ketat di Anchor 0.30+).
- Seeds PDA: `[b"papan", user.key().as_ref()]` di program ⇄
  `[Buffer.from("papan"), wallet.publicKey.toBuffer()]` di client — harus sama.

---

## Troubleshooting cepat

| Gejala | Penyebab umum |
|--------|----------------|
| `DeclaredProgramIdMismatch` | Lupa build ulang setelah `anchor keys sync`. Build lagi, deploy lagi. |
| `init_if_needed requires ...` | Fitur `init-if-needed` belum aktif di Cargo.toml. |
| Frontend: `Buffer is not defined` | Shim di `app/src/main.tsx` terhapus / ke-reorder. Harus jalan paling awal. |
| Fetch error saat pertama kali | Wajar — akun belum dibuat. Kirim pesan dulu, baru muat. |
| Transaksi gagal / saldo 0 | `solana airdrop 2` (devnet) dan pastikan Phantom di **Devnet**. |
