// src/utils/jwt.ts
interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;

  // Get current time in seconds
  const currentTime = Math.floor(Date.now() / 1000);

  // Check if token has expired
  return payload.exp < currentTime;
}

export { parseJwt, isTokenExpired };
