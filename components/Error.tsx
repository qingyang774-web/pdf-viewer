"use client";

interface ErrorProps {
  message?: string;
}

export default function ErrorState({ message = "Unable to load PDF" }: ErrorProps) {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-[#F5F5F5] px-6"
      role="alert"
    >
      <p className="text-center text-base text-neutral-600">{message}</p>
    </div>
  );
}
