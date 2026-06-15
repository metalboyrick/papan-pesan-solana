use anchor_lang::prelude::*;

// `anchor keys sync` rewrites this value (and the one in Anchor.toml) to match
// the deployed keypair. Run `anchor build` once first so the keypair exists.
declare_id!("PapanPesa111111111111111111111111111111111");

#[program]
pub mod papan_pesan {
    use super::*;

    /// Menyimpan pesan ke akun PDA milik si pengirim.
    ///
    /// `penulis` = siapa yang menulis (wallet pengirim)
    /// `pesan`   = teks pesannya (maks. 200 byte — lihat catatan space di bawah)
    pub fn store_data(ctx: Context<StoreData>, pesan: String) -> Result<()> {
        // ================================================================
        // TODO (live): isi badan fungsi ini di depan kelas.
        // Ambil akun papan dari context, lalu tulis penulis + pesan ke sana.
        //
        // ---- SOLUSI (ketik ini saat live coding) ----
        // let papan = &mut ctx.accounts.papan;
        // papan.penulis = ctx.accounts.user.key();
        // papan.pesan = pesan;
        // msg!("Pesan tersimpan: {}", papan.pesan);
        // Ok(())
        // ----------------------------------------------
        //
        // Sengaja dibuat error agar `anchor build` mengingatkan kalau badan
        // fungsi belum diisi. Hapus baris di bawah setelah mengetik solusi.
        // ================================================================
        let _ = (ctx, pesan);
        todo!("store_data: isi badan fungsi (lihat SOLUSI di komentar atau di solution/lib.rs)")
    }

    // CATATAN: TIDAK ADA `get_data` on-chain.
    //
    // Membaca data akun TIDAK butuh instruksi/transaksi. Client cukup
    // menghitung ulang alamat PDA lalu memanggil
    // `program.account.papan.fetch(pda)` — gratis, tanpa biaya gas.
    // Lihat `app/src/App.tsx` (fungsi getData) untuk sisi client-nya.
}

/// Akun yang dibutuhkan instruksi `store_data`.
#[derive(Accounts)]
pub struct StoreData<'info> {
    // init_if_needed:
    //   - akun belum ada  -> dibuat (init)
    //   - akun sudah ada  -> dipakai ulang (pesan di-overwrite) — bagus untuk demo
    // Butuh fitur "init-if-needed" di Cargo.toml (sudah ditambahkan).
    #[account(
        init_if_needed,
        payer = user,
        // space = 8 (discriminator) + 32 (penulis: Pubkey) + 4 (panjang String) + 200 (isi pesan)
        space = 8 + 32 + 4 + 200,
        seeds = [b"papan", user.key().as_ref()],
        bump
    )]
    pub papan: Account<'info, Papan>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Struktur data yang disimpan di dalam akun PDA `papan`.
#[account]
pub struct Papan {
    pub penulis: Pubkey, // 32 byte
    pub pesan: String,   // 4 byte panjang + maks 200 byte isi
}
