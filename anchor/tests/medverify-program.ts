import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MedverifyProgram } from "../target/types/medverify_program";
import { PublicKey } from "@solana/web3.js";
import assert from "assert";

describe("medverify-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.MedverifyProgram as Program<MedverifyProgram>;

  const LICENSE = "LIC-IND-2021-004812";

  // Derive the PDA for this license
  const [doctorPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("doctor"), Buffer.from(LICENSE)],
    program.programId
  );

  it("Registers a doctor", async () => {
    await program.methods
      .registerDoctor(
        LICENSE,
        "Dr. Aisha Khan",
        "General Medicine",
        "State Medical Council",
        "2021-05-14",
        "2026-05-13",
        "Riverstone Family Clinic",
        "+91 98xxxxxx21"
      )
      .accounts({ doctorRecord: doctorPda, authority: provider.wallet.publicKey })
      .rpc();

    const record = await program.account.doctorRecord.fetch(doctorPda);
    assert.equal(record.name, "Dr. Aisha Khan");
    assert.equal(record.registered, true);
    console.log("✅ Doctor registered on-chain");
  });

  it("Revokes a doctor", async () => {
    await program.methods
      .revokeDoctor()
      .accounts({ doctorRecord: doctorPda, authority: provider.wallet.publicKey })
      .rpc();

    const record = await program.account.doctorRecord.fetch(doctorPda);
    assert.equal(record.registered, false);
    console.log("✅ Doctor revoked on-chain");
  });
});
