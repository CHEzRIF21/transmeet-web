import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md rounded-lg border bg-card p-6 animate-pulse">Chargement…</div>}>
      <LoginForm />
    </Suspense>
  );
}
