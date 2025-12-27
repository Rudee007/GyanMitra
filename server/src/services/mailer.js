// server/services/mailer.js
const nodemailer = require('nodemailer');

/* ------------------------------------------------------------------
   1. Transport configuration – reads values from .env
   ------------------------------------------------------------------ */
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,                 // e.g. "smtp.gmail.com"
  port:   Number(process.env.SMTP_PORT),         // 465 for SSL, 587 for TLS
  secure: process.env.SMTP_SECURE === 'true',    // true ➜ port 465 + SSL
  auth: {
    user: process.env.SMTP_USER,                 // full mailbox
    pass: process.env.SMTP_PASS                  // app password / key
  }
});

/* ------------------------------------------------------------------
   2. Re-usable sendEmail helper
   ------------------------------------------------------------------ */
/**
 * Send an e-mail.
 * @param {Object} opts
 * @param {string} opts.to       Recipient address
 * @param {string} opts.subject  Subject line
 * @param {string} opts.html     HTML body (can include links, inline CSS, etc.)
 * @returns {Promise<nodemailer.SentMessageInfo>}
 */
module.exports = async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"Your-App" <${process.env.SMTP_USER}>`, // visible “From” header
    to,
    subject,
    html
  });
};