import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-ink-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-ink-200" />
          <div className="absolute inset-0 rounded-full border-2 border-t-ink-900 animate-spin" />
        </div>
        <p className="font-display text-sm font-medium text-ink-400 tracking-wide">Loading…</p>
      </div>
    </div>
  );
}
