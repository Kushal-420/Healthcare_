import { useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, RefreshCw } from "lucide-react";

export function QrScanner({
  onScanText,
}: {
  onScanText: (text: string) => void;
}) {
  const regionId = useMemo(
    () => `qr-reader-${Math.random().toString(16).slice(2)}`,
    []
  );
  const qrRef = useRef<Html5Qrcode | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      const qr = qrRef.current;
      qrRef.current = null;
      if (!qr) return;
      // best-effort cleanup
      qr
        .stop()
        .catch(() => undefined)
        .finally(() => {
          try {
            qr.clear();
          } catch {
            // ignore
          }
        });
    };
  }, []);

  async function start() {
    setError(null);
    try {
      const qr = new Html5Qrcode(regionId);
      qrRef.current = qr;

      const devices = await Html5Qrcode.getCameras();
      if (!devices?.length) {
        setError("No camera devices found. Try manual entry.");
        return;
      }

      await qr.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
        },
        (decodedText) => {
          onScanText(decodedText);
          // stop after first successful scan
          stop().catch(() => undefined);
        },
        () => {
          // ignore scan errors (noise)
        }
      );

      setActive(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to start camera. Check permissions."
      );
    }
  }

  async function stop() {
    setError(null);
    const qr = qrRef.current;
    if (!qr) {
      setActive(false);
      return;
    }
    try {
      await qr.stop();
    } finally {
      try {
        qr.clear();
      } catch {
        // ignore
      }
      qrRef.current = null;
      setActive(false);
    }
  }

  async function restart() {
    await stop();
    await start();
  }

  return (
    <section
      id="scan"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Scan QR</div>
          <div className="mt-0.5 text-sm text-slate-600">
            Point your camera at the doctor's QR code.
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!active ? (
            <button
              onClick={start}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
            >
              <Camera className="h-4 w-4" />
              Start
            </button>
          ) : (
            <button
              onClick={() => stop()}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              <CameraOff className="h-4 w-4" />
              Stop
            </button>
          )}
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Restart
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div id={regionId} className="min-h-[280px] w-full" />
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
          {error}
        </div>
      )}

      <div className="mt-3 text-xs text-slate-500">
        Works best on HTTPS (or localhost) and may require camera permission.
      </div>
    </section>
  );
}
