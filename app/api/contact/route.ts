import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();
    const company = String(body.company ?? "").trim();

    if (company.length > 0) {
      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (name.length > 100 || subject.length > 150 || message.length > 4000) {
      return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "moskwamarcel@gmail.com",
      replyTo: email,
      subject: subject || `New message from ${name}`,
      html: `
        <h2>New message from your portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    if (DISCORD_WEBHOOK_URL) {
      try {
        console.log("Sending to Discord webhook…");

        const resp = await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "📩 New portfolio message",
                fields: [
                  { name: "Name", value: name || "—", inline: true },
                  { name: "Email", value: email || "—", inline: true },
                  { name: "Subject", value: subject || "No subject", inline: false },
                  {
                    name: "Message",
                    value: message.slice(0, 1900) || "—",
                    inline: false,
                  },
                ],
                color: 5814783,
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });

        if (!resp.ok) {
          const text = await resp.text();
          console.error("Discord webhook responded with error:", resp.status, text);
        } else {
          console.log("Discord webhook sent OK:", resp.status);
        }
      } catch (err) {
        console.error("Discord webhook failed:", err);
      }
    } else {
      console.log("DISCORD_WEBHOOK_URL not set, skipping Discord");
    }

    return NextResponse.json({ message: "Message sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error sending contact message:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
