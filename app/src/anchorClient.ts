import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";

// ============================================================================
// IDL + Program ID
// ----------------------------------------------------------------------------
// Setelah `anchor build` (dan `anchor keys sync`), Anchor menulis IDL ke:
//   target/idl/papan_pesan.json
//
// SALIN file itu ke sini sebagai `idl/papan_pesan.json`, lalu import:
//
//   import idl from "./idl/papan_pesan.json";
//
// IDL untuk Anchor 0.30+ SUDAH memuat program id di field `address`, jadi
// `new Program(idl, provider)` cukup — tidak perlu mengoper program id lagi.
//
// Untuk membuat kelas tetap jalan sebelum file disalin, kita import via path
// relatif dan beri tipe `Idl`. Ganti komentar di bawah saat IDL sudah ada.
// ============================================================================

// Setelah menyalin IDL, hapus baris `placeholder` ini dan aktifkan import asli:
// import rawIdl from "./idl/papan_pesan.json";
// const idl = rawIdl as Idl;
import rawIdl from "./idl/papan_pesan.json";
const idl = rawIdl as Idl;

/**
 * Bangun objek Program Anchor dari koneksi + wallet yang sedang terhubung.
 * Anchor 0.30+: konstruktor 2 argumen -> new Program(idl, provider).
 */
export function getProgram(connection: Connection, wallet: AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return new Program(idl, provider);
}
