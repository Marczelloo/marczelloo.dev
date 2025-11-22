"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { useState } from "react";
import { TadpoleIcon } from "./ui/icons/svg-spinners-tadpole";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setLoading(true);
    const res = await fetch("api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setLoading(false);

    if (res.ok) {
      toast.success("Message sent successfully!");
      form.reset();
    } else {
      toast.error("Failed to send message. Please try again later.");
    }
  }

  return (
    <div className="w-full max-w-3xl lg:max-w-none justify-self-end">
      <form
        className="border border-border bg-card rounded-xl p-6 md:p-8 shadow-lg shadow-black/30 space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />
          <input
            type="text"
            placeholder="name"
            name="name"
            className="w-full border-b border-border bg-card/80 px-4 py-3 focus:rounded-lg text-sm md:text-base outline-none focus:border-(--accent-primary) focus:ring-1 focus:ring-(--accent-primary)/60 transition-shadow duration-150"
          />
          <input
            type="email"
            placeholder="email"
            name="email"
            className="w-full border-b border-border bg-card/80 px-4 py-3 text-sm md:text-base outline-none focus:rounded-lg focus:border-(--accent-primary) focus:ring-1 focus:ring-(--accent-primary)/60 transition-shadow duration-150"
          />
        </div>
        <input
          type="text"
          placeholder="subject"
          name="subject"
          className="w-full border-b border-border bg-card/80 px-4 py-3 text-sm md:text-base outline-none focus:border-(--accent-primary) focus:rounded-lg focus:ring-1 focus:ring-(--accent-primary)/60 transition-shadow duration-150"
        />
        <textarea
          placeholder="message"
          name="message"
          className="w-full bg-card/80 px-4 py-3 text-sm md:text-base outline-none border border-border/80 rounded-lg min-h-32 max-h-60 resize-y focus:border-(--accent-primary) focus:ring-1 focus:ring-(--accent-primary)/60 transition-shadow duration-150"
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
          <Button
            variant="default"
            size="lg"
            type="submit"
            className="cursor-pointer px-12 w-[150px]"
            disabled={loading}
          >
            {loading ? (
              <>
                Sending
                <TadpoleIcon className="inline-block ml-2 animate-spin" size={18} />
              </>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
