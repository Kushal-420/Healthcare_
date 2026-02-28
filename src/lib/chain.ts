import { getProgram, deriveDoctorPda, getReadonlyConnection } from "./anchor";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import type { MedverifyProgram } from "./medverify_program";

export type DoctorRecord = {
  licenseNumber: string;
  name: string;
  specialization: string;
  council: string;
  registeredSince: string;
  expiryDate: string;
  clinic: string;
  phone: string;
  registered: boolean;
  lastUpdated: number;
};

export type LookupResult =
  | { status: "registered"; record: DoctorRecord }
  | { status: "not_registered"; reason: string }
  | { status: "invalid"; reason: string };

// Cache for program instance when wallet is not available
let cachedProgram: Program<MedverifyProgram> | null = null;

export async function lookupLicense(
  licenseNumber: string,
  wallet: AnchorWallet | null
): Promise<LookupResult> {
  const key = licenseNumber.trim().toUpperCase();
  if (!key) return { status: "invalid", reason: "Empty license number." };

  try {
    let program: Program<MedverifyProgram>;
    
    if (wallet) {
      program = getProgram(wallet);
    } else {
      // For read-only operations without wallet, create a dummy wallet
      const connection = getReadonlyConnection();
      // Use a dummy keypair for read-only operations
      const dummyKeypair = {
        publicKey: new PublicKey("11111111111111111111111111111111"),
        signTransaction: async (tx: any) => tx,
        signAllTransactions: async (txs: any[]) => txs,
      } as AnchorWallet;
      
      const { AnchorProvider } = await import("@coral-xyz/anchor");
      const provider = new AnchorProvider(connection, dummyKeypair, {
        commitment: "confirmed",
      });
      const { Program, setProvider } = await import("@coral-xyz/anchor");
      setProvider(provider);
      
      if (!cachedProgram) {
        const idl = await import("./idl.json");
        cachedProgram = new Program(idl.default as MedverifyProgram, provider);
      }
      program = cachedProgram;
    }

    const pda = deriveDoctorPda(key);

    // Fetch the account. If it doesn't exist, Anchor throws.
    const record = await program.account.doctorRecord.fetch(pda);

    if (!record.registered) {
      return {
        status: "not_registered",
        reason: "License exists on-chain but has been revoked.",
      };
    }

    return {
      status: "registered",
      record: {
        licenseNumber: record.licenseNumber,
        name: record.name,
        specialization: record.specialization,
        council: record.council,
        registeredSince: record.registeredSince,
        expiryDate: record.expiryDate,
        clinic: record.clinic,
        phone: record.phone,
        registered: record.registered,
        lastUpdated: record.lastUpdated.toNumber(),
      },
    };
  } catch (e: unknown) {
    // Account not found = license not on chain
    if (e instanceof Error && e.message.includes("Account does not exist")) {
      return {
        status: "not_registered",
        reason: "No matching record found on-chain.",
      };
    }
    return { status: "invalid", reason: `Chain error: ${String(e)}` };
  }
}

// Fallback mock data for demo when Solana is not running
const MOCK_DATA: Record<string, DoctorRecord> = {
  "LIC-IND-2021-004812": {
    licenseNumber: "LIC-IND-2021-004812",
    name: "Dr. Aisha Khan",
    specialization: "General Medicine",
    council: "State Medical Council",
    registeredSince: "2021-05-14",
    expiryDate: "2026-05-13",
    clinic: "Riverstone Family Clinic",
    phone: "+91 98xxxxxx21",
    registered: true,
    lastUpdated: Date.now(),
  },
  "LIC-IND-2019-000177": {
    licenseNumber: "LIC-IND-2019-000177",
    name: "Dr. Rohan Mehta",
    specialization: "Orthopedics",
    council: "National Medical Register",
    registeredSince: "2019-01-09",
    expiryDate: "2027-01-08",
    clinic: "Summit Ortho & Rehab",
    phone: "+91 99xxxxxx77",
    registered: true,
    lastUpdated: Date.now(),
  },
};

// Demo mode lookup (uses mock data when Solana is not available)
export async function lookupLicenseDemo(licenseNumber: string): Promise<LookupResult> {
  await new Promise((r) => setTimeout(r, 450));
  
  const key = licenseNumber.trim().toUpperCase();
  if (!key) return { status: "invalid", reason: "Empty license number." };

  const record = MOCK_DATA[key];
  if (!record) {
    return {
      status: "not_registered",
      reason: "No matching record found in the registry.",
    };
  }

  if (!record.registered) {
    return {
      status: "not_registered",
      reason: "License number exists but is not registered/active.",
    };
  }

  return { status: "registered", record };
}
