# MedVerify - Quick Start Guide

Get your Solana healthcare dApp running in 5 minutes!

## Prerequisites

- Node.js v18+
- Rust (for Anchor)

## Step 1: Install Solana & Anchor

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Verify
solana --version
anchor --version
```

## Step 2: Setup Wallet

```bash
# Configure for local development
solana config set --url localhost

# Generate wallet
solana-keygen new --outfile ~/.config/solana/id.json --force

# Check address
solana address
```

## Step 3: Start Local Blockchain

Terminal 1 - Keep this running:
```bash
solana-test-validator
```

Terminal 2 - Get SOL:
```bash
solana airdrop 10
```

## Step 4: Install & Build

```bash
# Navigate to project
cd medverify

# Install dependencies
npm install

# Build and deploy smart contract
cd anchor
anchor build
anchor deploy
cd ..
```

## Step 5: Run the App

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## Test the App

1. **Demo Mode**: Toggle "Demo Mode" ON to test with mock data
2. **Connect Wallet**: Install Phantom wallet extension and connect
3. **Verify License**: Try these example licenses:
   - `LIC-IND-2021-004812` (Registered)
   - `LIC-IND-2019-000177` (Registered)
   - `LIC-IND-2016-009999` (Not registered)

## Register a Doctor (Admin)

```bash
cd anchor
anchor test
```

This runs the test suite which registers sample doctors.

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the smart contract in `anchor/programs/medverify-program/src/lib.rs`
- Customize the frontend in `src/pages/Home.tsx`

## Common Issues

| Issue | Solution |
|-------|----------|
| "solana: command not found" | Add Solana to PATH |
| "anchor: command not found" | Run `avm use latest` |
| "Account does not exist" | Run `anchor test` to register doctors |
| Wallet won't connect | Ensure Phantom extension is installed |

## Project Structure

```
medverify/
├── anchor/          # Smart contract
│   └── programs/medverify-program/src/lib.rs
├── src/
│   ├── components/  # React components
│   ├── lib/         # Blockchain integration
│   └── pages/       # Page components
└── README.md        # Full documentation
```

Happy building! 🚀
