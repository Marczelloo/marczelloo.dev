import { Button } from "./ui/button";
import { DiscordIcon } from "./ui/icons/discord-icon";
import { GmailIcon } from "./ui/icons/gmail-icon";
import { PhoneSolidIcon } from "./ui/icons/heroicons-phone-solid";
import CopyToClipboard from "./copyToClipboards";

export default function Contact() {
  return (
    <section id="Contact" className="w-full scroll-mt-16 md:scroll-mt-8">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-(--accent-text)">Contact</h2>
        <span className="hidden md:block h-px flex-1 bg-linear-to-r from-(--accent-text)/70 to-transparent" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] gap-8 lg:gap-12 justify-end">
        <div className="max-h-fit px-5 py-4 rounded-xl border border-border border-l-4 border-l-(--accent-primary) bg--card/80">
          <ul className="space-y-3">
            <li className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--accent-primary)/10 text-(--accent-primary)">
                <GmailIcon size={18} />
              </div>
              <a
                href="mailto:moskwamarcel@gmail.com"
                className="hover:text-(--accent-primary) transition-colors text-(--text-primary) font-medium"
              >
                moskwamarcel@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--accent-primary)/10 text-(--accent-primary)">
                <DiscordIcon size={18} />
              </div>
              <CopyToClipboard
                textToCopy="marczelloo"
                className="hover:text-(--accent-primary) transition-colors cursor-pointer text-(--text-primary) font-medium"
              />
            </li>
            <li className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--accent-primary)/10 text-(--accent-primary)">
                <PhoneSolidIcon size={18} className="text-(--accent-primary)" />
              </div>
              <a
                href="tel:+48 730 226 226"
                className="hover:text-(--accent-primary) transition-colors cursor-pointer text-(--text-primary) font-medium"
              >
                +48 730 226 226
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-3xl lg:max-w-none justify-self-end">
          <form className="border border-border bg-card rounded-xl p-6 md:p-8 shadow-lg shadow-black/30 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="name"
                className="w-full border-b border-border bg-card/80 px-4 py-3 rounded-t-xl text-sm md:text-base outline-none"
              />
              <input
                type="email"
                placeholder="email"
                className="w-full border-b border-border bg-card/80 px-4 py-3 text-sm md:text-base outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="subject"
              className="w-full border-b border-border bg-card/80 px-4 py-3 text-sm md:text-base outline-none"
            />
            <textarea
              placeholder="message"
              className="w-full bg-card/80 px-4 py-3 text-sm md:text-base outline-none border border-border/80 rounded-lg min-h-32 max-h-60 resize-y"
            />
            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between pt-2">
              <p className="text-sm text-(--text-secondary) font-semibold">
                Need my CV?{" "}
                <a
                  href="/lorem-ipsum.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--accent-primary) font-semibold underline"
                >
                  Download here
                </a>
              </p>
              <Button variant="default" size="lg" type="submit" className="cursor-pointer px-12">
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
