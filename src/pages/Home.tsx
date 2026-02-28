import { useMemo, useState } from "react";
import { ClipboardCheck, KeyRound, QrCode, Search, Link2 } from "lucide-react";
import { QrScanner } from "../components/QrScanner";
import { StatusCard } from "../components/StatusCard";
import { lookupLicense, lookupLicenseDemo, type LookupResult } from "../lib/chain";
import { parseQrText } from "../lib/parseQr";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{desc}</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [manual, setManual] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [useDemoMode, setUseDemoMode] = useState(true);
  
  const wallet = useAnchorWallet();

  const examples = useMemo(
    () => ["LIC-IND-2021-004812", "LIC-IND-2019-000177", "LIC-IND-2016-009999"],
    []
  );

  async function verify(licenseNumber: string) {
    setBusy(true);
    try {
      // Use demo mode if enabled or if wallet is not connected
      const res = useDemoMode || !wallet
        ? await lookupLicenseDemo(licenseNumber)
        : await lookupLicense(licenseNumber, wallet);
      setResult(res);
    } finally {
      setBusy(false);
    }
  }

  async function onScanText(text: string) {
    setLastScanned(text);
    const parsed = parseQrText(text);
    if (parsed.kind === "license") {
      setManual(parsed.licenseNumber);
      await verify(parsed.licenseNumber);
    } else if (parsed.kind === "url") {
      setResult({
        status: "invalid",
        reason: "QR contains a URL without a license parameter.",
      });
    } else {
      setResult({ status: "invalid", reason: "QR text could not be parsed." });
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <section className="grid gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            <ClipboardCheck className="h-4 w-4 text-emerald-600" />
            Verify a doctor's license in seconds
          </div>

          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Scan QR to confirm if a medical license is registered
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-base text-slate-600 md:text-lg">
            Use the camera scanner or manual input to check registration status.
            Powered by Solana blockchain for transparent, immutable verification.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Feature
              icon={QrCode}
              title="QR scanning"
              desc="Scan QR codes on ID cards, prescriptions or certificates."
            />
            <Feature
              icon={Search}
              title="Instant lookup"
              desc="Shows Registered / Not registered with key details."
            />
            <Feature
              icon={KeyRound}
              title="Fraud reduction"
              desc="Quickly detect mismatched or unregistered licenses."
            />
            <Feature
              icon={Link2}
              title="Blockchain powered"
              desc="Immutable records on Solana for maximum trust."
            />
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Mode Toggle */}
            <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-sm">
                <div className="font-semibold text-slate-900">Connection Mode</div>
                <div className="text-xs text-slate-500">
                  {useDemoMode ? "Using demo data (no wallet required)" : "Using Solana blockchain"}
                </div>
              </div>
              <button
                onClick={() => setUseDemoMode(!useDemoMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  useDemoMode ? "bg-emerald-500" : "bg-sky-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useDemoMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="text-sm font-semibold text-slate-900">Try an example</div>
            <div className="mt-2 text-sm text-slate-600">
              Use one of these license numbers:
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {examples.map((x) => (
                <button
                  key={x}
                  onClick={() => {
                    setManual(x);
                    void verify(x);
                  }}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {x}
                </button>
              ))}
            </div>

            <div id="manual" className="mt-5">
              <div className="text-sm font-semibold text-slate-900">Manual check</div>
              <div className="mt-2 flex gap-2">
                <input
                  value={manual}
                  onChange={(e) => setManual(e.target.value)}
                  placeholder="Enter license number"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-sky-200 focus:ring-4"
                />
                <button
                  disabled={busy}
                  onClick={() => void verify(manual)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search className="h-4 w-4" />
                  Verify
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Tip: QR may encode a URL like{" "}
                <span className="font-mono">.../verify?license=LIC-...</span>
              </div>
            </div>

            {lastScanned && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-500">Last QR text</div>
                <div className="mt-1 break-all font-mono text-xs text-slate-700">
                  {lastScanned}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <QrScanner onScanText={(t) => void onScanText(t)} />
        </div>
        <div className="md:col-span-5">
          {busy && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
              Verifying…
            </div>
          )}
          {!busy && result && <StatusCard result={result} onCopy={copy} />}
          {!busy && !result && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
              Scan a QR code or enter a license number to see results.
            </div>
          )}

          <section
            id="api"
            className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="text-sm font-semibold text-slate-900">
              Solana Blockchain Integration
            </div>
            <p className="mt-2 text-sm text-slate-600">
              This dApp connects to the Solana blockchain via Anchor framework. 
              Doctor registrations are stored as on-chain accounts with immutable records.
            </p>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold text-slate-500">Program ID</div>
              <div className="mt-1 font-mono text-xs text-slate-700 break-all">
                CAz5m1avkahj9Mud1qyH1HW7xjAV3wWxfFa3UrjdFWvh
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-500">Network</div>
              <div className="mt-1 font-mono text-xs text-slate-700">
                Localnet (localhost:8899)
              </div>
            </div>
            
            {!wallet && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-xs font-semibold text-amber-800">
                  Wallet not connected
                </div>
                <div className="mt-1 text-xs text-amber-700">
                  Connect your Phantom wallet to interact with the blockchain directly, 
                  or use demo mode to test the UI.
                </div>
              </div>
            )}
          </section>
        </div>
      </section>

      <footer className="mt-10 border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} MedVerify. Blockchain-powered license verification.
          </div>
          <div className="text-slate-400">
            Built on Solana with Anchor framework.
          </div>
        </div>
      </footer>
    </main>
  );
}
