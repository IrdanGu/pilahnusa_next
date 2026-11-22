// Security headers applied to every response before any route runs.
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), geolocation=(self), microphone=()');
  res.setHeader('X-XSS-Protection', '0');
  const forwardedProto = req.headers?.['x-forwarded-proto'];
  if (req.secure || (typeof forwardedProto === 'string' && forwardedProto.split(',')[0].trim() === 'https')) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
};

export default securityHeaders;
