import Resend from "@resend/node";

const resend = new Resend(process.env.RESEND_API_KEY); // ✅ use env var

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, phone, message } = req.body;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev>", // must be verified in Resend
      to: "bepolite744@gmail.com",
      subject: "New Contact Form Submission",
      html: `
        <h2>New Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending email" });
  }
}
