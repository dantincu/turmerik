"use client";
import { useEffect, useState } from "react";

export default function InitialLoader() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This code only runs once the browser has loaded React
    setIsHydrated(true);
  }, []);

  if (isHydrated) return null; // Remove the loader from the DOM

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
    </div>
  );
}
