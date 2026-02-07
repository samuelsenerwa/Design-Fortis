import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  dark: boolean;
  toggle: () => void;
  className?: string;
}

export default function ThemeToggle({ dark, toggle, className = "" }: ThemeToggleProps) {
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`cursor-pointer transition-opacity duration-300 hover:opacity-60 ${className}`}
    >
      {dark ? (
        <Sun />
      ) : (
        <Moon />
      )}
    </button>
  );
}
