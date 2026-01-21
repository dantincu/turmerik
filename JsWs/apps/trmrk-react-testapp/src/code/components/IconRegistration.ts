"use client"; // This tells Next.js this file runs in the browser

import { addIcon } from "@iconify/react";

import homeIcon from "@iconify-icons/mdi/home";
import closeIcon from "@iconify-icons/mdi/close";

// Register icons immediately when this file is loaded
addIcon("mdi:home", homeIcon);
addIcon("mdi:close", closeIcon);

export default function IconRegistration() {
  // This component doesn't render anything visible
  return null;
}
