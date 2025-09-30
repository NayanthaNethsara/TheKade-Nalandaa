import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
  sub: number;
  iat: number;
  exp: number;
  name: string;
  email: string;
  subscription: string;
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
    return decoded.name;
  } catch {
    return null;
  }
};

export const readIdFromJwt = (accessToken: string): number | null => {
  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
    return decoded.sub;
  } catch {
    return null;
  }
};
