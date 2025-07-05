export const buildAccountVerificationEmail = (url: string): string => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .container {
          background-color: #ffffff;
          max-width: 600px;
          margin: 20px auto;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
        }
        .header {
          color: #4a90e2;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 14px 28px;
          font-size: 16px;
          color: #ffffff;
          background-color: #4a90e2;
          text-decoration: none;
          border-radius: 6px;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Account Verification</div>
        <p>Thank you for registering. Please verify your account by clicking the button below:</p>
        <a href="${url}" class="button">Verify Account</a>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`;

export const buildCodeEmail = (purposeTitle: string, code: string): string => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .container {
          background-color: #ffffff;
          max-width: 600px;
          margin: 20px auto;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
        }
        .header {
          color: #4a90e2;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .code {
          font-size: 32px;
          font-weight: bold;
          color: #333333;
          background-color: #f0f0f0;
          display: inline-block;
          padding: 12px 24px;
          border-radius: 8px;
          letter-spacing: 4px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">${purposeTitle}</div>
        <p>Use the following code to ${purposeTitle.toLowerCase()}:</p>
        <div class="code">${code}</div>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`;
