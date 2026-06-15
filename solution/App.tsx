// REFERENCE SOLUTION — app/src/App.tsx (the two live-coded call sites only)
//
// This shows the COMPLETE, working bodies of storeData() and getData().
// Copy these into app/src/App.tsx if the class gets stuck. The rest of App.tsx
// (state, PDA computation, JSX) stays exactly as in the scaffold.

// --- storeData(): send the store_data instruction ---
async function storeData() {
  if (!program || !wallet) return;
  try {
    setStatus("Mengirim transaksi...");

    // .accountsPartial (NOT .accounts) — strict typing in Anchor 0.30+.
    // We only pass `user`; Anchor derives `papan` (PDA) and `system_program`.
    await program.methods
      .storeData(input)
      .accountsPartial({ user: wallet.publicKey })
      .rpc();

    setStatus("Tersimpan! Mengambil data...");
    await getData();
  } catch (e) {
    console.error(e);
    setStatus("Gagal: " + (e as Error).message);
  }
}

// --- getData(): read the account directly (no transaction, no gas) ---
async function getData() {
  if (!program || !papanPda) return;
  try {
    const akun = await program.account.papan.fetch(papanPda);
    setPesan(akun.pesan as string);
    setStatus("");
  } catch (e) {
    console.error(e);
    setPesan(null);
    setStatus("Belum ada pesan (atau gagal baca): " + (e as Error).message);
  }
}
