import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PapanPesan } from "../target/types/papan_pesan";
import { assert } from "chai";

describe("papan-pesan", () => {
  // Membaca cluster + wallet dari Anchor.toml (devnet).
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.papanPesan as Program<PapanPesan>;
  const user = provider.wallet.publicKey;

  // Hitung PDA: seeds = ["papan", wallet]
  const [papanPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("papan"), user.toBuffer()],
    program.programId
  );

  it("menyimpan lalu membaca pesan", async () => {
    const pesan = "Halo dari Solana!";

    // 1) STORE — kirim transaksi store_data.
    await program.methods
      .storeData(pesan)
      .accountsPartial({ user }) // .accountsPartial (BUKAN .accounts) untuk Anchor 0.30+
      .rpc();

    // 2) FETCH — baca akun langsung dari client (tanpa instruksi on-chain).
    const akun = await program.account.papan.fetch(papanPda);

    assert.equal(akun.pesan, pesan);
    assert.ok(akun.penulis.equals(user));
  });

  it("menimpa (overwrite) pesan lama karena init_if_needed", async () => {
    const pesanBaru = "Pesan kedua 🚀"; // emoji = 4 byte, tetap muat di 200 byte

    await program.methods
      .storeData(pesanBaru)
      .accountsPartial({ user })
      .rpc();

    const akun = await program.account.papan.fetch(papanPda);
    assert.equal(akun.pesan, pesanBaru);
  });
});
