import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
  sub: string;
  iat: number;
  exp: number;
  userId: number;
}
export const readRoleFromJwt = (accessToken: string): string | null => {
  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
    return decoded.role;
  } catch {
    return null;
  }
};

export const readNameFromJwt = (accessToken: string): string | null => {
  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
    return decoded.sub;
  } catch {
    return null;
  }
};

export const readIdFromJwt = (accessToken: string): number | null => {
  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
    return decoded.userId;
  } catch {
    return null;
  }
};
