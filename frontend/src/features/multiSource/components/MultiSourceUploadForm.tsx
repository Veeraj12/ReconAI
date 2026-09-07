"use client";

import { useRef } from "react";
import { FileUp, Plus, X, Loader2, Network } from "lucide-react";
import type { useMultiSource } from "../useMultiSource";

type MultiSourceHook = ReturnType<typeof useMultiSource>;

function FilePickerButton({
  file,
  onPick,
  placeholder,
}: {
  file: File | null;
  onPick: (file: File | null) => void;
  placeholder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border-app bg-row-alt/40 px-3 py-2.5 text-left text-xs transition-colors duration-150 hover:border-accent hover:bg-accent-soft/40"
    >
      <FileUp className="h-4 w-4 shrink-0 text-text-secondary" />
      <span className={`truncate ${file ? "font-medium text-text-primary" : "text-text-secondary"}`}>
        {file ? file.name : placeholder}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
    </button>
  );
}

export function MultiSourceUploadForm({ hook }: { hook: MultiSourceHook }) {
  const {
    primaryFile, setPrimaryFile, primaryLabel, setPrimaryLabel,
    secondarySources, addSecondarySource, removeSecondarySource, updateSecondarySource,
    canSubmit, isLoading, error, submit,
  } = hook;

  return (
    <div className="animate-fade-in-up mx-auto max-w-xl space-y-5 rounded-xl border border-border-app bg-bg-panel p-6 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-dark">
          <Network className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="font-display text-[15px] font-semibold text-text-primary">
            Multi-Source Reconciliation
          </h2>
          <p className="text-xs text-text-secondary">
            Reconcile one primary source against two or more secondary sources at once.
          </p>
        </div>
      </div>

      {/* Primary source */}
      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-text-secondary">
          Primary source (the hub — usually your bank statement)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={primaryLabel}
            onChange={(e) => setPrimaryLabel(e.target.value)}
            placeholder="Label, e.g. Bank"
            className="w-32 shrink-0 rounded-lg border border-border-app bg-bg-panel px-2.5 py-2 text-xs text-text-primary outline-none focus:border-accent"
          />
          <div className="flex-1">
            <FilePickerButton file={primaryFile} onPick={setPrimaryFile} placeholder="Choose primary file…" />
          </div>
        </div>
      </div>

      {/* Secondary sources */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wide text-text-secondary">
            Secondary sources (reconciled against the primary)
          </label>
          <button
            type="button"
            onClick={addSecondarySource}
            className="flex items-center gap-1 text-[11px] font-semibold text-accent-dark hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add source
          </button>
        </div>

        <div className="space-y-2">
          {secondarySources.map((source) => (
            <div key={source.id} className="flex items-center gap-2">
              <input
                type="text"
                value={source.label}
                onChange={(e) => updateSecondarySource(source.id, { label: e.target.value })}
                placeholder="Label, e.g. Tally"
                className="w-32 shrink-0 rounded-lg border border-border-app bg-bg-panel px-2.5 py-2 text-xs text-text-primary outline-none focus:border-accent"
              />
              <div className="flex-1">
                <FilePickerButton
                  file={source.file}
                  onPick={(file) => updateSecondarySource(source.id, { file })}
                  placeholder="Choose file…"
                />
              </div>
              {secondarySources.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSecondarySource(source.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors duration-150 hover:bg-danger-soft hover:text-danger"
                  aria-label="Remove source"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-danger-soft px-3 py-2 text-xs font-medium text-danger">{error}</p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit || isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-accent-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin-slow" />
            Reconciling {secondarySources.filter((s) => s.file).length} secondary source(s)…
          </>
        ) : (
          <>
            <Network className="h-4 w-4" />
            Run Multi-Source Reconciliation
          </>
        )}
      </button>
    </div>
  );
}
