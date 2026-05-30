import { AuthPayload, AuthTokens } from "@/types/auth.types";
import jwt from "jsonwebtoken";

export class JwtService {
  private secret = process.env.JWT_SECRET || "your-secret-key";
  private refreshSecret = process.env.JWT_REFRESH_SECRET || "your-refresh-secret";
  private expiration = process.env.JWT_EXPIRATION || "15m";
  private refreshExpiration = process.env.JWT_REFRESH_EXPIRATION || "7d";

  /**
   * Generate JWT token pair (access + refresh)
   */
  generateTokens(payload: AuthPayload): AuthTokens {
    const accessToken = jwt.sign(payload, this.secret, {
      expiresIn: this.expiration as any,
    });

    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiration as any,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verify and decode access token
   */
  verifyAccessToken(token: string): AuthPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as AuthPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Verify and decode refresh token
   */
  verifyRefreshToken(token: string): AuthPayload | null {
    try {
      const decoded = jwt.verify(token, this.refreshSecret) as AuthPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      return parts[1];
    }
    return null;
  }
}

export const jwtService = new JwtService();
