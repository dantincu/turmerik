"use client";

import { useTheme } from "next-themes";

import TrmrkBtn from "@/src/trmrk-react/components/TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "@/src/trmrk-react/components/TrmrkIcon/TrmrkIcon";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === "dark";

  return (<div className="flex-row">
      <TrmrkBtn
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="trmrk-btn-filled-ternary mr-[2px] mt-[2px]"
      >
        <TrmrkIcon icon={`material-symbols:${isDarkMode ? "light-mode" : "dark-mode"}`} /> {isDarkMode ? "Light" : "Dark"} Mode
      </TrmrkBtn>
    </div>
  );
}
