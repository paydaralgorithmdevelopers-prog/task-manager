import { AuthPayload, AuthTokens } from "@/types/auth.types";
import jwt from "jsonwebtoken";

export class JwtService {
  private readonly secret =
    process.env.JWT_SECRET ?? "change-me-in-production-use-long-random-string";
  private readonly refreshSecret =
    process.env.JWT_REFRESH_SECRET ??
    "change-me-refresh-in-production-use-long-random-string";
  private readonly expiration = process.env.JWT_EXPIRATION ?? "15m";

  generateTokens(
    payload: AuthPayload,
    options?: { refreshExpiresInDays?: number }
  ): AuthTokens {
    const refreshDays = options?.refreshExpiresInDays ?? 7;
    const accessToken = jwt.sign(payload, this.secret, {
      expiresIn: this.expiration as jwt.SignOptions["expiresIn"],
    });
    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: `${refreshDays}d`,
    });
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, this.secret) as AuthPayload;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, this.refreshSecret) as AuthPayload;
    } catch {
      return null;
    }
  }

  extractTokenFromHeader(authHeader?: string | null): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") return parts[1];
    return null;
  }
}

export const jwtService = new JwtService();

