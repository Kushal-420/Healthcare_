export type ParsedQr =
  | { kind: "license"; licenseNumber: string }
  | { kind: "url"; url: string }
  | { kind: "unknown"; raw: string };

/**
 * Accepts:
 * - Plain license: "LIC-IND-2021-004812"
 * - URL with query param: https://example.com/verify?license=LIC-...
 */
export function parseQrText(text: string): ParsedQr {
  const raw = (text ?? "").trim();
  if (!raw) return { kind: "unknown", raw: "" };

  // Looks like a URL
  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      const license = u.searchParams.get("license") || u.searchParams.get("lic");
      if (license) return { kind: "license", licenseNumber: license };
      return { kind: "url", url: raw };
    } catch {
      return { kind: "unknown", raw };
    }
  }

  // If it contains spaces or key=value, try to extract license-like token
  const match = raw.match(/LIC-[A-Z]{2,}-\d{4}-\d{4,}/i);
  if (match) return { kind: "license", licenseNumber: match[0].toUpperCase() };

  // Otherwise treat as a license string directly
  return { kind: "license", licenseNumber: raw.toUpperCase() };
}
