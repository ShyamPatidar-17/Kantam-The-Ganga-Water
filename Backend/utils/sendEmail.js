import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Kantam Logistics" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td align="center" style="padding: 20px 10px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 40px; border: 1px solid #e2e8f0; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); overflow: hidden;">
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    
                    <div style="background-color: #2563eb; width: 60px; height: 60px; border-radius: 20px; margin: 0 auto 20px;">
                      <span style="color: white; font-size: 30px; line-height: 60px; display: block;">💧</span>
                    </div>

                    <h1 style="color: #0f172a; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0 0 10px 0;">
                      Verify Your <span style="color: #2563eb;">Identity</span>
                    </h1>
                    
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
                      Radhe Radhe! We received a request to access your Kantam account. Use the code below to proceed with the password reset.
                    </p>

                    <div style="background-color: #f1f5f9; border-radius: 25px; padding: 25px; margin-bottom: 30px;">
                      <span style="font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #0f172a; font-family: monospace;">
                        ${options.otp}
                      </span>
                    </div>

                    <p style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 30px 0;">
                      Expires in 10 Minutes
                    </p>

                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 0 0 30px 0;">

                    <p style="color: #cbd5e1; font-size: 10px; font-style: italic; margin: 0; line-height: 1.4;">
                      If you did not request this, please ignore this email or contact Kantam support.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin-top: 20px; color: #94a3b8; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px;">
                Kantam • Systematic Logistics
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;