import { useForm, ValidationError } from "@formspree/react";
import Button from "../components/ui/Button";

interface ContactUsProps {
  dark: boolean;
}

export default function ContactUs({ dark }: ContactUsProps) {
  const [state, handleSubmit] = useForm("mykbeoyn");

  return (
    <main
      className={`min-h-screen pt-20 pb-24 transition-colors duration-700 ${
        dark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Contact Info */}
          <div className="space-y-12">
            <h2
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-tight mb-8 ${
                dark ? "text-white" : "text-black"
              }`}
            >
              LET&apos;S TALK
            </h2>
            <div>
              <p
                className={`text-sm md:text-base font-normal leading-relaxed ${
                  dark ? "text-white/70" : "text-black/70"
                }`}
              >
                Start a conversation. We are here to listen and help bring your vision to life with
                clarity and emotion.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3
                  className={`text-xs uppercase tracking-widest mb-2 ${
                    dark ? "text-white/50" : "text-black/50"
                  }`}
                >
                  EMAIL
                </h3>
                <a
                  href="mailto:designfortis.ke@gmail.com"
                  className={`text-base md:text-lg font-normal hover:opacity-70 transition-opacity ${
                    dark ? "text-white" : "text-black"
                  }`}
                >
                  designfortis.ke@gmail.com
                </a>
              </div>

              <div>
                <h3
                  className={`text-xs uppercase tracking-widest mb-2 ${
                    dark ? "text-white/50" : "text-black/50"
                  }`}
                >
                  PHONE
                </h3>
                <a
                  href="tel:+254796136945"
                  className={`text-base md:text-lg font-normal hover:opacity-70 transition-opacity ${
                    dark ? "text-white" : "text-black"
                  }`}
                >
                  +254 796 136945
                </a>
              </div>

              <div>
                <h3
                  className={`text-xs uppercase tracking-widest mb-2 ${
                    dark ? "text-white/50" : "text-black/50"
                  }`}
                >
                  STUDIO
                </h3>
                <p className={`text-base md:text-lg font-normal ${dark ? "text-white" : "text-black"}`}>
                  Mombasa, Kenya
                </p>
              </div>
            </div>

            <div className="flex gap-6 pt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs uppercase tracking-widest hover:opacity-70 transition-opacity ${
                  dark ? "text-white/70" : "text-black/70"
                }`}
              >
                INSTAGRAM
              </a>
              <a
                href="https://www.linkedin.com/in/joshua-nyabuto-277b75222/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs uppercase tracking-widest hover:opacity-70 transition-opacity ${
                  dark ? "text-white/70" : "text-black/70"
                }`}
              >
                LINKEDIN
              </a>
              <a
                href="https://behance.net"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs uppercase tracking-widest hover:opacity-70 transition-opacity ${
                  dark ? "text-white/70" : "text-black/70"
                }`}
              >
                BEHANCE
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs uppercase tracking-widest hover:opacity-70 transition-opacity ${
                  dark ? "text-white/70" : "text-black/70"
                }`}
              >
                PINTEREST
              </a>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            {state.succeeded ? (
              <div className="py-12">
                <p className={`text-lg font-normal ${dark ? "text-white" : "text-black"}`}>
                  Thank you for reaching out! We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="YOUR NAME"
                    required
                    className={`w-full px-0 py-3 bg-transparent border-b ${
                      dark
                        ? "border-white/20 text-white placeholder-white/40"
                        : "border-black/20 text-black placeholder-black/40"
                    } focus:outline-none focus:border-opacity-60 transition-colors text-sm tracking-wider`}
                  />
                  <ValidationError prefix="Name" field="name" errors={state.errors} />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="EMAIL ADDRESS"
                    required
                    className={`w-full px-0 py-3 bg-transparent border-b ${
                      dark
                        ? "border-white/20 text-white placeholder-white/40"
                        : "border-black/20 text-black placeholder-black/40"
                    } focus:outline-none focus:border-opacity-60 transition-colors text-sm tracking-wider`}
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} />
                </div>

                <div>
                  <select
                    name="interested"
                    required
                    defaultValue=""
                    className={`w-full px-0 py-3 bg-transparent border-b ${
                      dark
                        ? "border-white/20 text-white/40"
                        : "border-black/20 text-black/40"
                    } focus:outline-none focus:border-opacity-60 transition-colors text-sm tracking-wider appearance-none cursor-cursor`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${
                        dark ? "%23ffffff" : "%23000000"
                      }' opacity='0.4' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0 center",
                    }}
                  >
                    <option value="">INTERESTED IN</option>
                    <option value="Residential Design">Residential Design</option>
                    <option value="Commercial Design">Commercial Design</option>
                    <option value="Interior Design">Interior Design</option>
                    <option value="3D Visualization">3D Visualization</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Other">Other</option>
                  </select>
                  <ValidationError prefix="Interested" field="interested" errors={state.errors} />
                </div>

                <div>
                  <input
                    type="text"
                    name="fileLink"
                    placeholder="FILE LINK (WE-TRANSFER / DRIVE / DROPBOX)"
                    className={`w-full px-0 py-3 bg-transparent border-b ${
                      dark
                        ? "border-white/20 text-white placeholder-white/40"
                        : "border-black/20 text-black placeholder-black/40"
                    } focus:outline-none focus:border-opacity-60 transition-colors text-sm tracking-wider`}
                  />
                  <ValidationError prefix="File Link" field="fileLink" errors={state.errors} />
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="TELL US ABOUT YOUR PROJECT"
                    required
                    rows={6}
                    className={`w-full px-0 py-3 bg-transparent border-b ${
                      dark
                        ? "border-white/20 text-white placeholder-white/40"
                        : "border-black/20 text-black placeholder-black/40"
                    } focus:outline-none focus:border-opacity-60 transition-colors text-sm tracking-wider resize-none`}
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} />
                </div>

                <div className="pt-4">
                  <Button
                    disabled={state.submitting}
                    variant="outline"
                    className="w-full"
                  >
                    {state.submitting ? "SENDING..." : "SEND MESSAGE"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}