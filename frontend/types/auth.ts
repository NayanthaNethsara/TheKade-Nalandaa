export interface LoginRequest {
  username: string;
  password: string;
}

export interface JWTPayload {
  subscription: string;
  role: "Reader" | "Author" | "Admin";
  exp: number;
}

export interface DecodedJWT {
  subscription: string;
  role: string;
  exp: number;
}
