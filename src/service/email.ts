import nodemailer from 'nodemailer';

export type EmailData = {
  from: string;
  subject: string;
  message: string;
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});

export async function sendEmail({ from, subject, message }: EmailData) {
  const mailData = {
    to: process.env.AUTH_USER,
    from,
    subject: `[BLOG] ${subject}`,
    html: `
    <h1>${subject}</h1>
    <div>${message}</div>
    <br/>
    <p>보낸사람: ${from}</p>
   `,
  };

  return transporter.sendMail(mailData);
}
