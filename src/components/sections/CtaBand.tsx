import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface CtaBandProps {
  dark: boolean;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  buttonLabel?: string;
  to?: string;
  className?: string;
}

/**
 * Reusable "Let's Talk"-style call-to-action block, used after each
 * homepage section and by the Footer's inquiries block.
 */
export default function CtaBand({
  dark,
  eyebrow = "Inquiries",
  heading,
  subheading,
  buttonLabel = "Start a Project",
  to = "/contact",
  className = "",
}: CtaBandProps) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  return (
    <div
      ref={ref}
      className={`max-w-480 mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 ${className}`}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <h4
            className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 ${
              dark ? "text-white/50" : "text-black/50"
            }`}
          >
            {eyebrow}
          </h4>
        )}
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-extralight leading-[1.1] ${
            dark ? "text-white" : "text-black"
          }`}
        >
          {heading}
          {subheading && (
            <>
              <br />
              <span className="opacity-50 font-light">{subheading}</span>
            </>
          )}
        </h2>
      </div>
      <div>
        <Button
          variant="outline"
          size="lg"
          data-cursor="hover"
          onClick={() => navigate(to)}
          className="px-6 py-4 md:px-10 md:py-6 lg:px-14 lg:py-8 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] font-bold"
          aria-label={buttonLabel}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
