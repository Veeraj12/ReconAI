import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      {/* <div className="flex flex-col items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-lg font-bold text-white">
          R
        </span>
        <div className="text-center">
          <p className="text-base font-bold text-text-primary">Create your account</p>
          <p className="text-xs text-text-secondary">ReconAI · Bank &amp; Tally Reconciliation</p>
        </div>
      </div> */}

      <RegisterForm />
    </div>
  );
}
