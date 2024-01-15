import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';

const { InternalServerError } = createHttpError

const BASE_URL = 'http://localhost:2024';


async function mailSender(email, title, body) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: 'Prince from PayPhlet <princewilling10@gmail.com>',
    to: email,
    subject: title,
    html: body,
  });

  return info;
}

export async function sendEmailToken(emailToken, user, subject) {
  try {
    const mailResponse = await mailSender(
      user.email,
      subject,
      getEmailBody(user, emailToken)
    );
    // console.log('Email sent successfully:', mailResponse);
  } catch (e) {
    console.log('Error sending email', e);
    throw InternalServerError();
  }
}

function getEmailBody(user, emailToken) {
  const emailBody = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beyond Borders</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #fff;
        color: #333; /* Changed text color to improve readability */
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
  
      .container {
        width: 80%;
        max-width: 600px;
        padding: 30px;
        background-color: #01040a; /* Removed unnecessary rgb() */
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        text-align: center;
      }
  
      .header {
        color: rgb(255, 255, 255);
        font-size: 23px;
        font-weight: bold;
        margin-bottom: 20px;
      }
  
      .message, .messagexxx, .link {
        font-size: 18px;
        color: #ffffff;
        margin-bottom: 20px;
        line-height: 1.5;
      }
  
      .message {
        font-size: 15px; /* Adjusted font size */
      }
  
      .otp {
        font-size: 32px;
        font-weight: bold;
        color: #3498db;
        display: block;
        margin: 20px 0;
        padding: 15px;
        background-color: #3498db;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
      }
  
      .otp:hover {
        background-color: #2980b9;
      }
  
      .footer {
        color: #777;
        font-size: 14px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">♾️ PayPhlet ♾️</div>
      <p class="messagexxx">Hello, ${user.name}! 👋</p>
      <p class="message">Use one-time password (OTP) below to verify your email and complete your signup to PayPhlet. Don't share your OTP</p>
      <a class="otp">${emailToken}</a>
      <p class="messagexxx">OTP expires soon! ⏳</p>
      <p class="footer">💱 Thank you for choosing PayPhlet. 💱</p>
    </div>
  </body>
  </html>   
  `;
  return emailBody;
}