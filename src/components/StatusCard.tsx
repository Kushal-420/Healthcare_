import { motion } from "framer-motion";
import { BadgeCheck, Ban, CircleAlert, Copy } from "lucide-react";
import type { LookupResult } from "../lib/chain";

function formatDate(s: string | number) {
  if (!s || s === "—") return s;
  try {
    const d = typeof s === "number" ? new Date(s) : new Date(s);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  } catch {
    return String(s);
  }
}

export function StatusCard({
  result,
  onCopy,
}: {
  result: LookupResult;
  onCopy: (text: string) => void;
}) {
  const meta =
    result.status === "registered"
      ? {
          title: "Registered",
          subtitle: "License is active in the registry",
          icon: BadgeCheck,
          ring: "ring-emerald-200",
          bg: "bg-emerald-50",
          fg: "text-emerald-900",
        }
      : result.status === "not_registered"
        ? {
            title: "Not registered",
            subtitle: result.reason,
            icon: Ban,
            ring: "ring-rose-200",
            bg: "bg-rose-50",
            fg: "text-rose-900",
          }
        : {
            title: "Invalid input",
            subtitle: result.reason,
            icon: CircleAlert,
            ring: "ring-amber-200",
            bg: "bg-amber-50",
            fg: "text-amber-900",
          };

  const Icon = meta.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-4 ${meta.ring}`}
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 grid h-10 w-10 place-items-center rounded-xl ${meta.bg} ${meta.fg}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{meta.title}</div>
            <div className="mt-0.5 text-sm text-slate-600">{meta.subtitle}</div>
          </div>
        </div>

        {result.status === "registered" && (
          <button
            onClick={() => onCopy(result.record.licenseNumber)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
        )}
      </div>

      {result.status === "registered" && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-medium text-slate-500">Doctor</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {result.record.name}
            </div>
            <div className="mt-0.5 text-sm text-slate-600">{result.record.specialization}</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-medium text-slate-500">License number</div>
            <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
              {result.record.licenseNumber}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-medium text-slate-500">Council</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {result.record.council}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-medium text-slate-500">Validity</div>
            <div className="mt-1 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{formatDate(result.record.registeredSince)}</span>
              <span className="text-slate-500"> → </span>
              <span className="font-semibold text-slate-900">{formatDate(result.record.expiryDate)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-medium text-slate-500">Clinic</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {result.record.clinic || "—"}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-medium text-slate-500">Last verified</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {formatDate(result.record.lastUpdated)}
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
