import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

import {
  RabbitMQService,
} from '@shared/rabbitmq';

import {
  UserEvents,
  DomainEvent
} from '@shared/contracts';

@Injectable()
export class UsersService {
  constructor(
    private readonly rabbitmqService: RabbitMQService,
    private prisma: PrismaService
  ) { }

  async create(data: CreateUserDto) {
    const { roles, ...userData } = data;

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: await bcrypt.hash(data.password, 10),
        roles: roles && roles.length > 0
          ? {
            create: roles.map((roleId) => ({ role: { connect: { id: roleId } } })),
          }
          : undefined,
      },
      include: { roles: { include: { role: true } } },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll() {
    return this.prisma.user.findMany({
      omit: { password: true },
      include: { roles: { include: { role: true } } },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: { include: { role: true } } },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, data: UpdateUserDto) {

    const { roles, ...userData } = data;
    const updatedUser = await this.prisma.user.update({
      where: { id },
      omit: { password: true },
      data: {
        ...userData
      },
    });

    if (!updatedUser.id) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (roles) {
      await this.prisma.userRole.deleteMany({ where: { userId: id } });
      if (roles.length > 0) {
        await this.prisma.userRole.createMany({
          data: roles.map((roleId) => ({
            userId: id,
            roleId,
          })),
        });
      }
    }

    const userUpdatedEvent: DomainEvent<{ userId: string; updatedAt: Date }> = {
      eventType: UserEvents.USER_UPDATED,
      payload: {
        userId: updatedUser.id,
        updatedAt: new Date(),
      },
      timestamp: new Date(),
    };

    await this.rabbitmqService.publish(
      UserEvents.USER_UPDATED,
      userUpdatedEvent,
    );

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.userRole.deleteMany({ where: { userId: id } });
    return this.prisma.user.delete({ where: { id } });
  }
}