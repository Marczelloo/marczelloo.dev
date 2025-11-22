import { DiscordIcon } from "./ui/icons/discord-icon";
import { GmailIcon } from "./ui/icons/gmail-icon";
import CopyToClipboard from "./copyToClipboards";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="Contact" className="w-full scroll-mt-16 md:scroll-mt-8">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-(--accent-text)">Contact</h2>
        <span className="hidden md:block h-px flex-1 bg-linear-to-r from-(--accent-text)/70 to-transparent" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] gap-8 lg:gap-12 justify-end">
        <div className="max-h-fit px-5 py-4 rounded-xl border border-border border-l-4 border-l-(--accent-primary)">
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
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
