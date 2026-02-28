import { ShieldCheck } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-slate-900">
              MedVerify
            </div>
            <div className="text-xs text-slate-500">Doctor license verification</div>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
            href="#scan"
          >
            Scan QR
          </a>
          <a
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
            href="#manual"
          >
            Manual check
          </a>
          <a
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
            href="#api"
          >
            Blockchain
          </a>
        </div>

        <div className="flex items-center gap-2">
          <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700" />
        </div>
      </div>
    </header>
  );
}
