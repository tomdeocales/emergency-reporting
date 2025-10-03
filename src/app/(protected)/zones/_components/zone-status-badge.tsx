import type { ZoneStatus } from "@/types/zones";

const STATUS_THEME: Record<ZoneStatus, string> = {
  Stable: "bg-emerald-500/10 text-emerald-600",
  Watch: "bg-amber-500/10 text-amber-600",
  Critical: "bg-red-500/10 text-red-600",
};

export function ZoneStatusBadge({ status }: { status: ZoneStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_THEME[status]}`}
    >
      {status}
    </span>
  );
}
