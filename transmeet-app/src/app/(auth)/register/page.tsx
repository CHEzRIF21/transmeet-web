import { Suspense } from "react";
import { PhoneSignupForm } from "./PhoneSignupForm";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md rounded-lg border bg-card p-6 animate-pulse">
          Chargement…
        </div>
      }
    >
      <PhoneSignupForm />
    </Suspense>
  );
}
