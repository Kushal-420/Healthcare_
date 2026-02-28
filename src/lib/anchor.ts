import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "./idl.json";
import type { MedverifyProgram } from "./medverify_program";

// Change to "devnet" or "mainnet-beta" for production
export const NETWORK = "http://localhost:8899";
export const PROGRAM_ID = new PublicKey("CAz5m1avkahj9Mud1qyH1HW7xjAV3wWxfFa3UrjdFWvh");

export function getProgram(wallet: AnchorWallet): Program<MedverifyProgram> {
  const connection = new Connection(NETWORK, "confirmed");
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  setProvider(provider);
  return new Program(idl as MedverifyProgram, provider);
}

export function deriveDoctorPda(licenseNumber: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [new TextEncoder().encode("doctor"), new TextEncoder().encode(licenseNumber)],
    PROGRAM_ID
  );
  return pda;
}

// For read-only operations (no wallet required)
export function getReadonlyConnection(): Connection {
  return new Connection(NETWORK, "confirmed");
}
