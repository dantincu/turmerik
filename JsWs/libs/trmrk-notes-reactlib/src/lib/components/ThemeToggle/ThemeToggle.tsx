"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import TrmrkBtn from "@/src/trmrk-react/components/TrmrkBtn/TrmrkBtn";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mounting
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (<div className="flex-row">
      <TrmrkBtn
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="trmrk-btn-filled-warn mr-[2px] mt-[2px]"
      >
        {resolvedTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </TrmrkBtn>
    </div>
  );
}
