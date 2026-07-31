"use client";

export default function Loading() {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-[#F5F5F5]"
      role="status"
      aria-live="polite"
      aria-label="Loading PDF"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-neutral-300 border-t-neutral-700" />
      <p className="text-sm text-neutral-500">Loading PDF…</p>
    </div>
  );
}
