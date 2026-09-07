"use client";

import { useState } from "react";
import { FileSpreadsheet, Landmark, Loader2, UploadCloud } from "lucide-react";

interface UploadFormProps {
  onSubmit: (bankFile: File, tallyFile: File) => void;
  isLoading: boolean;
}

function FileField({
  label,
  icon: Icon,
  accept,
  file,
  onChange,
}: {
  label: string;
  icon: typeof Landmark;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-inverse">
        <Icon className="h-3.5 w-3.5 text-text-inverse-muted" />
        {label}
      </label>
      <label
        className={`group flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs transition-all duration-180 ${
          file
            ? "border-accent/50 bg-accent/10 text-text-inverse"
            : "border-dashed border-border-dark bg-bg-app-soft text-text-inverse-muted hover:border-accent/40 hover:bg-white/5"
        }`}
      >
        <UploadCloud
          className={`h-4 w-4 shrink-0 transition-colors ${file ? "text-accent" : "text-text-inverse-muted group-hover:text-text-inverse"}`}
        />
        <span className="min-w-0 flex-1 truncate">
          {file ? file.name : `Choose ${label.toLowerCase()} file...`}
        </span>
        <input
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>
    </div>
  );
}

export function UploadForm({ onSubmit, isLoading }: UploadFormProps) {
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [tallyFile, setTallyFile] = useState<File | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!bankFile || !tallyFile) return;
    onSubmit(bankFile, tallyFile);
  }

  return (
    <form onSubmit={handleSubmit}>
      <FileField
        label="Bank Statement"
        icon={Landmark}
        accept=".xlsx,.xls,.csv,.pdf"
        file={bankFile}
        onChange={setBankFile}
      />
      <FileField
        label="Tally Export"
        icon={FileSpreadsheet}
        accept=".xlsx,.xls,.csv"
        file={tallyFile}
        onChange={setTallyFile}
      />

      <button
        type="submit"
        disabled={isLoading || !bankFile || !tallyFile}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-3.5 py-2.5 text-xs font-semibold text-white shadow-[var(--shadow-glow-accent)] transition-all duration-150 hover:bg-accent-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
      >
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin-slow" />}
        {isLoading ? "Processing..." : "Start Reconciliation"}
      </button>
    </form>
  );
}
