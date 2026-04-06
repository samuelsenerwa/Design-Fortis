import Button from "../ui/Button";

interface FooterProps {
  dark: boolean;
}

export default function Footer({ dark }: FooterProps) {
  return (
    <footer
      className={`max-w-[1920px] mx-auto px-6 md:px-12 py-8 mt-20 transition-colors duration-700 border-t ${
        dark ? "bg-black border-white/15" : "bg-white border-black/15"
      }`}
    >
      {/* Inquiries Section */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-8">
        <div className="mb-12" />
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="max-w-2xl">
            <h4
              className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 ${
                dark ? "text-white/50" : "text-black/50"
              }`}
            >
              Inquiries
            </h4>
            <h2
              className={`text-4xl md:text-5xl lg:text-6xl font-extralight leading-[1.1] ${
                dark ? "text-white" : "text-black"
              }`}
            >
              Have a vision in mind?
              <br />
              <span className="opacity-50 font-light">
                Let's build something timeless.
              </span>
            </h2>
          </div>
          <div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/contact'}
              className="px-6 py-4 md:px-10 md:py-6 lg:px-14 lg:py-8 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] font-bold"
              aria-label="Start a Project"
            >
              Start a Project
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={`max-w-[1920px] mx-auto px-6 md:px-12 py-8 border-t ${dark ? "border-white/15" : "border-black/15"}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div
            className={`text-xs uppercase tracking-widest opacity-60 ${
              dark ? "text-white" : "text-black"
            }`}
          >
            © {new Date().getFullYear()} Design Fortis
          </div>
          <div className="flex gap-6">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/designfortisfdn?igsh=MmNuYnJqd3FlNmU="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={`transition-colors ${
                dark ? "text-white hover:text-white/60" : "text-black hover:text-black/60"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
                <rect width="256" height="256" fill="none" />
                <circle cx="128" cy="128" r="32" />
                <path d="M172,28H84A56.06353,56.06353,0,0,0,28,84v88a56.06353,56.06353,0,0,0,56,56h88a56.06353,56.06353,0,0,0,56-56V84A56.06353,56.06353,0,0,0,172,28ZM128,176a48,48,0,1,1,48-48A48.05436,48.05436,0,0,1,128,176Zm52-88a12,12,0,1,1,12-12A12,12,0,0,1,180,88Z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/joshua-nyabuto-277b75222/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={`transition-colors ${
                dark ? "text-white hover:text-white/60" : "text-black hover:text-black/60"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
                <path d="M32 31.292V19.46c0-6.34-3.384-9.29-7.896-9.29-3.641 0-5.273 2.003-6.182 3.409v-2.924h-6.86c.091 1.937 0 20.637 0 20.637h6.86V19.767c0-.615.044-1.232.226-1.672.495-1.233 1.624-2.509 3.518-2.509 2.483 0 3.475 1.892 3.475 4.666v11.041H32v-.001zM3.835 7.838c2.391 0 3.882-1.586 3.882-3.567C7.673 2.247 6.227.707 3.881.707S0 2.246 0 4.271c0 1.981 1.489 3.567 3.792 3.567h.043zm3.43 23.454V10.655H.406v20.637h6.859z" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a
              href="https://wa.me/254796136945"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={`transition-colors ${
                dark ? "text-white hover:text-white/60" : "text-black hover:text-black/60"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
                <rect width="256" height="256" fill="none" />
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm43.83,145.07a12,12,0,0,1-10.63,6.46,11.86,11.86,0,0,1-5.46-1.32C139.43,166,121.83,158.25,108,144.18c-14-14.08-21.56-31.64-29.68-47.56A12,12,0,0,1,89.08,80.9l8.34-3.13a8,8,0,0,1,10.21,4.57l8.06,20.15a8,8,0,0,1-1.88,8.81l-6.64,6.64a1,1,0,0,0-.2,1.1c3.76,7.52,9.9,15.7,16.4,22.2s14.49,12.7,22,16.46a1,1,0,0,0,1.11-.2l6.63-6.64a8,8,0,0,1,8.82-1.87l20.15,8.06a8,8,0,0,1,4.57,10.21Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
