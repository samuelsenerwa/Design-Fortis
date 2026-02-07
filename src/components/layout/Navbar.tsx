import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ThemeToggle from "../ui/ThemeToggle";

interface NavbarProps {
  dark: boolean;
  toggleTheme: () => void;
}

const NAV_LINKS = [
  { label: "HOME", href: "#" },
  { label: "WORK", href: "#work" },
  { label: "ARCHIVE", href: "#archive" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

const DESKTOP_LINKS = NAV_LINKS.filter((l) => l.label !== "HOME" && l.label !== "WORK");

export default function Navbar({ dark, toggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const lastScrollY = useRef(0);
  const navHidden = useRef(false);

  useEffect(() => {
    if (!overlayRef.current || !linksRef.current || !toggleRef.current) return;

    const links = linksRef.current.children;
    const toggle = toggleRef.current;

    // Set initial hidden state for links and toggle
    gsap.set(links, { y: 40, opacity: 0 });
    gsap.set(toggle, { y: 20, opacity: 0 });

    tl.current = gsap.timeline({ paused: true });

    tl.current
      .to(overlayRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.6,
        ease: "power4.inOut",
      })
      .to(
        links,
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.2"
      )
      .to(
        toggle,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.2"
      );

    return () => {
      tl.current?.kill();
    };
  }, []);

  // Scroll-direction hide/show for desktop (md+)
  useEffect(() => {
    const SCROLL_THRESHOLD = 10;
    const md = window.matchMedia("(min-width: 768px)");

    const handleScroll = () => {
      if (!navRef.current || !md.matches) return;

      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (delta > SCROLL_THRESHOLD && currentY > 64 && !navHidden.current) {
        // Scrolling down — hide
        navHidden.current = true;
        gsap.to(navRef.current, {
          y: "-100%",
          duration: 0.35,
          ease: "power2.inOut",
        });
      } else if (delta < -SCROLL_THRESHOLD && navHidden.current) {
        // Scrolling up — show
        navHidden.current = false;
        gsap.to(navRef.current, {
          y: "0%",
          duration: 0.35,
          ease: "power2.inOut",
        });
      }

      lastScrollY.current = currentY;
    };

    // Reset nav position when switching to mobile
    const handleResize = () => {
      if (!md.matches && navRef.current && navHidden.current) {
        navHidden.current = false;
        gsap.set(navRef.current, { y: "0%" });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      if (overlayRef.current) overlayRef.current.style.pointerEvents = "auto";
      tl.current?.restart();
      document.body.style.overflow = "hidden";
    } else {
      tl.current?.reverse();
      document.body.style.overflow = "";
      const duration = (tl.current?.duration() ?? 0.6) * 1000;
      setTimeout(() => {
        if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
      }, duration);
    }
  }, [menuOpen]);

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="mx-auto flex h-16 items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <a
            href="#"
            className="text-lg font-semibold tracking-[0.2em] text-foreground uppercase"
          >
            Design Fortis
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {DESKTOP_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-medium tracking-[0.2em] text-foreground/70 uppercase transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle dark={dark} toggle={toggleTheme} />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden cursor-pointer text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-100 bg-background flex flex-col items-center justify-center"
        style={{ clipPath: "inset(0% 0% 100% 0%)", pointerEvents: "none" }}
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          className="absolute top-5 right-6 cursor-pointer text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Mobile nav links */}
        <div ref={linksRef} className="flex flex-col items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-xl font-light tracking-[0.3em] text-foreground uppercase transition-colors duration-300 hover:text-foreground/60"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Theme toggle in mobile menu */}
        <div ref={toggleRef} className="mt-12">
          <ThemeToggle dark={dark} toggle={toggleTheme} />
        </div>
      </div>
    </>
  );
}
