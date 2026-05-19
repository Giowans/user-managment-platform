import { PrismaService } from '../prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {
  RabbitMQService,
} from '@shared/rabbitmq';

import {
  AuthEvents,
  UserLoggedInPayload,
  DomainEvent
} from '@shared/contracts';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly rabbitmqService: RabbitMQService,
  ) { }

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return {
      message: 'User registered successfully',
    };
  }

  async login(data: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(data.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((userRole) => ({
        id: userRole.role.id,
        name: userRole.role.name,
      })),
    };

    const userLoggedInEvent: DomainEvent<UserLoggedInPayload> = {
      eventType: AuthEvents.USER_LOGGED_IN,
      payload: {
        userId: user.id,
        email: user.email,
        roles: user.roles.map((userRole) => ({
          id: userRole.role.id,
          name: userRole.role.name,
        })),
      },
      timestamp: new Date(),
    };

    await this.rabbitmqService.publish(
      AuthEvents.USER_LOGGED_IN,
      userLoggedInEvent,
    );

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}