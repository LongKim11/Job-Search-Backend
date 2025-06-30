export function parseExpiryToSeconds(expiry: string): number {
  const regex = /^(\d+)([smhd])$/;
  const match = expiry.match(regex);
  if (!match) throw new Error('Invalid expiry format in env');

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      throw new Error('Invalid expiry unit');
  }
}
