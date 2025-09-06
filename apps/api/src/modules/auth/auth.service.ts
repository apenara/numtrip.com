import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private supabase;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = this.configService.get('SUPABASE_SERVICE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are required. Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, password); // Will be replaced with actual hash check
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: { email: string; password: string }) {
    // Use Supabase for authentication
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    // Get or create user in our database
    let user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: loginDto.email,
          verified: true,
        },
      });
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        verified: user.verified,
      },
      supabaseSession: data.session,
    };
  }

  async register(registerDto: { email: string; password: string; name?: string; phone?: string }) {
    // Check if user already exists in our database
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Register with Supabase
    const { data, error } = await this.supabase.auth.signUp({
      email: registerDto.email,
      password: registerDto.password,
      options: {
        data: {
          name: registerDto.name,
          phone: registerDto.phone,
        },
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Create user in our database
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        phone: registerDto.phone,
        verified: false, // Will be true after email verification
      },
    });

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        verified: user.verified,
      },
      message: 'Please check your email to verify your account',
    };
  }

  async verifyEmail(token: string) {
    const { data, error } = await this.supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Update user verification status
    if (data.user) {
      await this.prisma.user.update({
        where: { email: data.user.email },
        data: { verified: true },
      });
    }

    return { message: 'Email verified successfully' };
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return data.session;
  }

  async logout(accessToken: string) {
    const { error } = await this.supabase.auth.signOut();
    
    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        ownedBusinesses: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async verifyToken(token: string) {
    try {
      // In development, handle mock tokens
      if (process.env.NODE_ENV === 'development' && token === 'mock-access-token-xyz') {
        // Get or create mock user in database
        let user = await this.prisma.user.findUnique({
          where: { email: 'demo@numtrip.com' },
        });

        if (!user) {
          user = await this.prisma.user.create({
            data: {
              id: 'mock-user-123',
              email: 'demo@numtrip.com',
              name: 'Demo User',
              verified: true,
            },
          });
        }

        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            verified: user.verified,
          },
        };
      }

      // Normal Supabase token verification
      const { data, error } = await this.supabase.auth.getUser(token);
      
      if (error) {
        throw new UnauthorizedException('Invalid token');
      }

      // Get user from our database
      const user = await this.prisma.user.findUnique({
        where: { email: data.user.email },
      });

      if (!user) {
        throw new UnauthorizedException('User not found in database');
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          verified: user.verified,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}