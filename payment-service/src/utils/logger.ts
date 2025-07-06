import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logPaymetExpired = (to: string, message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] To: ${to} | Error: ${message}\n`;
  const filePath = path.join(logDir, 'payment-expired.log');

  fs.appendFile(filePath, logMessage, (err) => {
    if (err) {
      console.error('[Logger] ❌ Failed to write to log file:', err.message);
    }
  });
};
