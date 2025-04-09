"use client";

import { useEffect, useState } from "react";

export function DukeLogo() {
  // Optionally delay rendering until after mount to avoid any discrepancy
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder if not yet mounted
  if (!mounted) return null;

  return (
    <img
      src="/images/logos/duke-logo.png"
      alt="Duke University"
      className="h-16 w-auto"
    />
  );
}
