// REFERENCE SOLUTION — programs/papan-pesan/src/lib.rs
//
// This is the COMPLETE, working version of the program with the live-coding
// TODO filled in. Copy `store_data`'s body from here if the class gets stuck.
// Do NOT compile this file directly — it mirrors the real lib.rs.

use anchor_lang::prelude::*;

declare_id!("PapanPesa111111111111111111111111111111111");

#[program]
pub mod papan_pesan {
    use super::*;

    pub fn store_data(ctx: Context<StoreData>, pesan: String) -> Result<()> {
        // ---- THE TWO/THREE LINES WRITTEN LIVE ----
        let papan = &mut ctx.accounts.papan;
        papan.penulis = ctx.accounts.user.key();
        papan.pesan = pesan;
        msg!("Pesan tersimpan: {}", papan.pesan);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct StoreData<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + Papan::INIT_SPACE,
        seeds = [b"papan", user.key().as_ref()],
        bump
    )]
    pub papan: Account<'info, Papan>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Papan {
    pub penulis: Pubkey,
    pub pesan: String,
}
