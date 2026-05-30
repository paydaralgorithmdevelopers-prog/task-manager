import { userRepository } from '@/server/repositories/user.repository';
import { hashPassword, verifyPassword, validatePasswordStrength } from '@/server/utils/password';
import { generateTokenPair, verifyRefreshToken } from '@/server/utils/jwt';
import {
  UnauthorizedError,
  BadRequestError,
  ConflictError,
  ValidationError,
} from '@/server/utils/errors';
import { SignupInput, LoginInput } from '@/server/utils/validators';

export class AuthService {
  /**
   * Register a new user
   */
  async signup(data: SignupInput) {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(data.password);
    if (!passwordValidation.valid) {
      throw new ValidationError('Password does not meet requirements', {
        password: passwordValidation.errors.join(', '),
      });
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      emailVerified: false,
    });

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await userRepository.createSession({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      tokens,
    };
  }

  /**
   * Login user
   */
  async login(data: LoginInput, ipAddress?: string, userAgent?: string) {
    // Find user by email
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await verifyPassword(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new UnauthorizedError('Account is suspended or inactive');
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await userRepository.createSession({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      expiresAt,
      ipAddress,
      deviceInfo: userAgent ? { userAgent } : undefined,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        status: user.status,
      },
      tokens,
    };
  }

  /**
   * Logout user
   */
  async logout(refreshToken: string) {
    await userRepository.deleteSession(refreshToken);
    return { success: true };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if session exists
    const session = await userRepository.findSessionByRefreshToken(refreshToken);
    if (!session) {
      throw new UnauthorizedError('Session not found');
    }

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      await userRepository.deleteSession(refreshToken);
      throw new UnauthorizedError('Session expired');
    }

    // Get user
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Generate new tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    // Update session with new refresh token
    await userRepository.deleteSession(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await userRepository.createSession({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      tokens,
    };
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      status: user.status,
      emailVerified: user.emailVerified,
    };
  }

  /**
   * Change password
   */
  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      throw new ValidationError('Password does not meet requirements', {
        password: passwordValidation.errors.join(', '),
      });
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update user
    await userRepository.update(userId, { passwordHash });

    // Delete all sessions to force re-login
    await userRepository.deleteAllUserSessions(userId);

    return { success: true };
  }
}

export const authService = new AuthService();
