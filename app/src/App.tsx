import { useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { getProgram } from "./anchorClient";

export default function App() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet(); // wallet bertipe AnchorWallet (punya publicKey + sign)
  const { connected } = useWallet();

  const [input, setInput] = useState("");
  const [pesan, setPesan] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  // Bangun Program hanya saat wallet sudah terhubung.
  const program = useMemo(() => {
    if (!wallet) return null;
    return getProgram(connection, wallet);
  }, [connection, wallet]);

  // Hitung alamat PDA: seeds = ["papan", wallet]. Sama persis dengan di program.
  const papanPda = useMemo(() => {
    if (!program || !wallet) return null;
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("papan"), wallet.publicKey.toBuffer()],
      program.programId
    );
    return pda;
  }, [program, wallet]);

  // ==========================================================================
  // TODO (live): KIRIM PESAN ke on-chain
  // --------------------------------------------------------------------------
  // Panggil instruksi store_data dengan teks dari `input`.
  // Ingat: pakai .accountsPartial({ user }) — BUKAN .accounts (typing ketat
  // di Anchor 0.30+).
  //
  // ---- SOLUSI (ketik ini saat live coding) ----
  // await program.methods
  //   .storeData(input)
  //   .accountsPartial({ user: wallet.publicKey })
  //   .rpc();
  // ----------------------------------------------
  // ==========================================================================
  async function storeData() {
    if (!program || !wallet) return;
    try {
      setStatus("Mengirim transaksi...");

      // TODO (live): ganti baris di bawah dengan pemanggilan .storeData(...) di atas.
      throw new Error("storeData belum diisi — lihat SOLUSI di komentar / solution/App.tsx");

      setStatus("Tersimpan! Mengambil data...");
      await getData();
    } catch (e) {
      console.error(e);
      setStatus("Gagal: " + (e as Error).message);
    }
  }

  // ==========================================================================
  // TODO (live): BACA PESAN dari on-chain (tanpa transaksi, gratis)
  // --------------------------------------------------------------------------
  // Ambil akun di alamat `papanPda` lalu tampilkan field `pesan`.
  //
  // ---- SOLUSI (ketik ini saat live coding) ----
  // const akun = await program.account.papan.fetch(papanPda);
  // setPesan(akun.pesan as string);
  // ----------------------------------------------
  // CATATAN: jika akun belum pernah dibuat, fetch akan throw — itu wajar.
  // ==========================================================================
  async function getData() {
    if (!program || !papanPda) return;
    try {
      // TODO (live): ganti baris di bawah dengan fetch akun di atas.
      throw new Error("getData belum diisi — lihat SOLUSI di komentar / solution/App.tsx");
    } catch (e) {
      console.error(e);
      setPesan(null);
      setStatus("Belum ada pesan (atau gagal baca): " + (e as Error).message);
    }
  }

  return (
    <main style={styles.main}>
      <h1>Papan Pesan 📝</h1>
      <p style={styles.sub}>On-chain message board · Solana devnet</p>

      <WalletMultiButton />

      {connected && wallet ? (
        <section style={styles.card}>
          <div style={styles.row}>
            <input
              style={styles.input}
              placeholder="Tulis pesanmu (maks ~200 byte)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button style={styles.btn} onClick={storeData}>
              Kirim
            </button>
          </div>

          <button style={styles.btnGhost} onClick={getData}>
            Muat pesan tersimpan
          </button>

          <div style={styles.out}>
            <strong>Pesan saat ini:</strong> {pesan ?? "—"}
          </div>

          {status && <p style={styles.status}>{status}</p>}

          <p style={styles.hint}>
            PDA: <code>{papanPda?.toBase58() ?? "—"}</code>
          </p>
        </section>
      ) : (
        <p style={styles.hint}>Hubungkan Phantom (devnet) untuk mulai.</p>
      )}
    </main>
  );
}

// Inline styles agar tidak perlu file CSS tambahan — fokus ke logika Solana.
const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: 560, margin: "48px auto", fontFamily: "system-ui, sans-serif", padding: "0 16px" },
  sub: { color: "#666", marginTop: -8 },
  card: { marginTop: 24, padding: 20, border: "1px solid #e3e3e3", borderRadius: 12 },
  row: { display: "flex", gap: 8 },
  input: { flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", fontSize: 15 },
  btn: { padding: "10px 18px", borderRadius: 8, border: "none", background: "#512da8", color: "#fff", cursor: "pointer", fontSize: 15 },
  btnGhost: { marginTop: 12, padding: "8px 14px", borderRadius: 8, border: "1px solid #512da8", background: "#fff", color: "#512da8", cursor: "pointer" },
  out: { marginTop: 16, padding: 12, background: "#f6f4fc", borderRadius: 8 },
  status: { marginTop: 12, color: "#444", fontSize: 14 },
  hint: { marginTop: 16, color: "#888", fontSize: 13, wordBreak: "break-all" },
};
