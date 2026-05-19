import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { RabbitMQModule } from '@shared/rabbitmq';
import { AuditConsumer } from './consumer/audit.consumer';
import { AuditLogsService } from './consumer/audit-logs.service';

@Module({
  imports: [
    RabbitMQModule,
    MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }]),
  ],
  controllers: [AuditController],
  providers: [AuditService, AuditConsumer, AuditLogsService],
  exports: [AuditService],
})
export class AuditModule { }
