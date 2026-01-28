"use client";

import React from "react";

interface ButtonWithCallbackProps {
  label: string;
  onClick: () => void;
  variant: "no-memo" | "with-callback";
}

// Component without React.memo - will re-render when parent re-renders
function ButtonWithoutMemo({ label, onClick }: { label: string; onClick: () => void }) {
  console.log(`[No Memo] Button rendered with label: ${label}`);
  
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {label}
    </button>
  );
}

// Component with React.memo - only re-renders when props change
const ButtonWithMemo = React.memo(({ label, onClick }: { label: string; onClick: () => void }) => {
  console.log(`[With Memo] Button rendered with label: ${label}`);
  
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      {label}
    </button>
  );
});

ButtonWithMemo.displayName = "ButtonWithMemo";

export function ButtonWithCallback({ label, onClick, variant }: ButtonWithCallbackProps) {
  if (variant === "no-memo") {
    return <ButtonWithoutMemo label={label} onClick={onClick} />;
  }
  
  return <ButtonWithMemo label={label} onClick={onClick} />;
}

