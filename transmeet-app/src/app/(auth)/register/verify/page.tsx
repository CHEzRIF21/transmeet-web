import { Suspense } from "react";
import { VerifyOtpForm } from "./VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md rounded-lg border bg-card p-6 animate-pulse">
          Chargement…
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
