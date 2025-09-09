export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  sub: string;
  role: "ADMIN" | "CITIZEN";
  exp: number;
}
