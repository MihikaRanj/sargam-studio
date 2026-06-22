import nodemailer from 'nodemailer';

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body as ContactBody;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Sargam Studio Contact" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `[Sargam Studio] ${subject}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}