import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      {/* <div className="flex flex-col items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-lg font-bold text-white">
          R
        </span>
        <div className="text-center">
          <p className="text-base font-bold text-text-primary">ReconAI</p>
          <p className="text-xs text-text-secondary">Bank &amp; Tally Reconciliation</p>
        </div>
      </div> */}

      <LoginForm />

      {/* <p className="text-center text-xs text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-accent hover:text-accent-dark">
          Register
        </Link>
      </p> */}
    </div>
  );
}
