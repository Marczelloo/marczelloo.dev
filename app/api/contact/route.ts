import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
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
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              title: "📩 New portfolio message",
              fields: [
                { name: "Name", value: String(name), inline: true },
                { name: "Email", varlue: String(email), inline: true },
                { name: "Subject", value: subject ? String(subject) : "No subject", inline: false },
                { name: "Message", value: String(message), inline: false },
              ],
              color: 5814783,
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
    }

    return NextResponse.json({ message: "Message sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error sending contact message:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
