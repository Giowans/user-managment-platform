import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetAuditLogsDto } from './dtos/get-audit-logs.dto';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async findAll(filters: GetAuditLogsDto) {
    const { userEmail, role, eventType, startDate, endDate, metadataOnly } = filters;
    const query: any = {};

    if (userEmail) query.userEmail = userEmail;
    if (role) query.role = role;
    if (eventType) query.eventType = eventType;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await this.auditLogModel.find(query).exec();

    if (metadataOnly) {
      return logs.map((log) => log.metadata);
    }

    return logs;
  }

  async findOne(id: string) {
    const log = await this.auditLogModel.findById(id).exec();
    if (!log) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }
    return log;
  }
}
