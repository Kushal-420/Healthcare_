# MedVerify - Solana Healthcare dApp

A blockchain-powered medical license verification system built on Solana using the Anchor framework. This dApp allows users to verify doctor licenses by scanning QR codes or entering license numbers manually.

## Features

- **QR Code Scanning**: Scan QR codes on ID cards, prescriptions, or certificates
- **Manual License Lookup**: Enter license numbers directly for verification
- **Blockchain Integration**: Immutable records stored on Solana
- **Wallet Connection**: Connect with Phantom wallet for blockchain interactions
- **Demo Mode**: Test the UI without a running Solana node

## Project Structure

```
medverify/
├── anchor/                    # Solana smart contract (Anchor)
│   ├── programs/
│   │   └── medverify-program/
│   │       └── src/
│   │           └── lib.rs     # Smart contract code
│   ├── tests/
│   │   └── medverify-program.ts  # Anchor tests
│   └── Anchor.toml            # Anchor configuration
├── src/
│   ├── components/            # React components
│   │   ├── QrScanner.tsx      # QR code scanner
│   │   ├── StatusCard.tsx     # Verification result display
│   │   └── TopNav.tsx         # Navigation bar with wallet button
│   ├── lib/                   # Utility libraries
│   │   ├── anchor.ts          # Anchor/wallet setup
│   │   ├── chain.ts           # On-chain lookup functions
│   │   ├── idl.json           # Program IDL
│   │   ├── medverify_program.ts # TypeScript types
│   │   └── parseQr.ts         # QR code parser
│   ├── pages/
│   │   └── Home.tsx           # Main page
│   ├── App.tsx                # Root component
│   └── main.tsx               # Entry point with wallet providers
├── package.json
├── vite.config.ts
└── README.md
```

## Prerequisites

Before running this project, ensure you have the following installed:

1. **Node.js** (v18 or higher)
2. **Rust** (for Anchor)
3. **Solana CLI**
4. **Anchor CLI**

## Step-by-Step Setup Guide

### Step 1: Install Solana CLI

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

Add to your PATH (add this to `~/.bashrc` or `~/.zshrc`):
```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

Verify installation:
```bash
solana --version
# Expected: solana-cli 1.18.x
```

### Step 2: Configure Solana for Local Development

```bash
# Use local validator (free, no real SOL needed)
solana config set --url localhost

# Generate a new keypair (your wallet)
solana-keygen new --outfile ~/.config/solana/id.json

# Check your address
solana address
```

### Step 3: Install Anchor

```bash
# Install AVM (Anchor Version Manager)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install latest Anchor version
avm install latest
avm use latest

# Verify
anchor --version
# Expected: anchor-cli 0.30.x
```

### Step 4: Start Local Validator

Open a dedicated terminal and keep it running:

```bash
solana-test-validator
```

In another terminal, airdrop yourself SOL:

```bash
solana airdrop 10
```

### Step 5: Install Frontend Dependencies

```bash
# Navigate to the project directory
cd medverify

# Install dependencies
npm install
```

### Step 6: Build and Deploy the Anchor Program

```bash
# Navigate to the anchor directory
cd anchor

# Build the program
anchor build

# Deploy to local validator
anchor deploy

# The program ID will be displayed - update it in:
# - src/lib/anchor.ts
# - src/lib/idl.json
# - Anchor.toml
```

### Step 7: Run Tests

```bash
# In the anchor directory
anchor test
```

### Step 8: Start the Frontend

```bash
# In the project root directory
npm run dev
```

The app will be available at `http://localhost:5173`

## How It Works

### Smart Contract (Anchor)

The smart contract (`anchor/programs/medverify-program/src/lib.rs`) provides two main instructions:

1. **`register_doctor`**: Registers a new doctor with their license details
2. **`revoke_doctor`**: Revokes a doctor's registration (admin only)

Doctor records are stored as PDA (Program Derived Address) accounts, derived from the license number.

### Frontend Integration

The frontend connects to the Solana blockchain using:

- **@solana/wallet-adapter-react**: Wallet connection management
- **@coral-xyz/anchor**: Interacting with the smart contract
- **html5-qrcode**: QR code scanning

Key files:
- `src/lib/anchor.ts`: Sets up the Anchor provider and program
- `src/lib/chain.ts`: Handles on-chain lookups
- `src/main.tsx`: Wraps the app with wallet providers

### Data Flow

```
User scans QR / enters license
         │
         ▼
  parseQr.ts extracts licenseNumber
         │
         ▼
  chain.ts: lookupLicense()
         │
         ▼
  deriveDoctorPda(licenseNumber)
  → deterministic PDA address
         │
         ▼
  program.account.doctorRecord.fetch(pda)
  → Solana RPC call to local/devnet validator
         │
         ├── Account exists + registered=true  → StatusCard: ✅ Registered
         ├── Account exists + registered=false → StatusCard: ❌ Revoked  
         └── Account not found                 → StatusCard: ❌ Not Registered
```

## Configuration

### Network Settings

Edit `src/main.tsx` to change the network:

```typescript
// For local development
const NETWORK = "http://localhost:8899";

// For devnet
const NETWORK = "https://api.devnet.solana.com";

// For mainnet
const NETWORK = "https://api.mainnet-beta.solana.com";
```

### Program ID

After deploying, update the program ID in:

1. `src/lib/anchor.ts`:
```typescript
export const PROGRAM_ID = new PublicKey("YOUR_PROGRAM_ID_HERE");
```

2. `src/lib/idl.json`:
```json
{
  "address": "YOUR_PROGRAM_ID_HERE"
}
```

## Usage

### Demo Mode

The app includes a demo mode that uses mock data when Solana is not running. Toggle this in the UI to test the interface without a blockchain connection.

### With Blockchain

1. Connect your Phantom wallet using the "Select Wallet" button
2. Toggle off "Demo Mode"
3. Enter a license number or scan a QR code
4. The app will query the Solana blockchain for the license status

### Admin Operations

To register a doctor on-chain (requires admin wallet):

```typescript
import { getProgram } from "./lib/anchor";

const program = getProgram(wallet);
const licenseNumber = "LIC-IND-2021-004812";

// Derive PDA
const [doctorPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("doctor"), Buffer.from(licenseNumber)],
  program.programId
);

// Register doctor
await program.methods
  .registerDoctor(
    licenseNumber,
    "Dr. Aisha Khan",
    "General Medicine",
    "State Medical Council",
    "2021-05-14",
    "2026-05-13",
    "Riverstone Family Clinic",
    "+91 98xxxxxx21"
  )
  .accounts({
    doctorRecord: doctorPda,
    authority: wallet.publicKey,
  })
  .rpc();
```

## Moving to Devnet/Mainnet

1. **Change network configuration**:
   ```typescript
   const NETWORK = "https://api.devnet.solana.com";
   ```

2. **Update Anchor.toml**:
   ```toml
   [provider]
   cluster = "devnet"
   ```

3. **Deploy to devnet**:
   ```bash
   anchor deploy --provider.cluster devnet
   ```

4. **Get devnet SOL**:
   ```bash
   solana airdrop 2 --url devnet
   ```

## Troubleshooting

### "Account does not exist" error

This means the license hasn't been registered on-chain. Use the admin functions to register doctors first.

### Wallet connection issues

- Ensure Phantom wallet extension is installed
- Check that you're on the correct network (localhost/devnet/mainnet)

### Build errors

If you encounter Buffer-related errors, ensure `vite-plugin-node-polyfills` is configured in `vite.config.ts`.

## Quick Commands Cheatsheet

```bash
# Solana
solana-test-validator            # Start local chain
solana airdrop 10                # Get free SOL (localnet)
solana config set --url localhost
solana config set --url devnet   # Switch to devnet

# Anchor
anchor build                     # Compile the Rust program
anchor test                      # Build + deploy + run tests
anchor deploy                    # Deploy to configured cluster
anchor deploy --provider.cluster devnet  # Deploy to devnet

# Frontend
npm run dev                      # Start Vite dev server
npm run build                    # Build for production
```

## License

MIT License - feel free to use this project for your own healthcare verification needs.

## Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Phantom Wallet](https://phantom.app/)
