import { Button } from "./ui/button";

export default function Contact() {
  return (
    <section id="Contact" className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-(--accent-text)">Contact</h2>
        <span className="hidden md:block h-px flex-1 bg-linear-to-r from-(--accent-text)/70 to-transparent" />
      </div>
      <div className="mx-auto w-full max-w-3xl">
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
              <a href="/path/to/cv.pdf" className="text-(--accent-primary) font-semibold underline">
                Download here
              </a>
            </p>
            <Button variant="default" size="lg" type="submit" className="cursor-pointer px-12">
              Send
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
