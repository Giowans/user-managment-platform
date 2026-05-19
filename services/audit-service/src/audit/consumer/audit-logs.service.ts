import {
    Injectable,
} from '@nestjs/common';

import {
    InjectModel,
} from '@nestjs/mongoose';

import {
    Model,
} from 'mongoose';

import {
    AuditLog,
} from '../schemas/audit-log.schema';

@Injectable()
export class AuditLogsService {

    constructor(

        @InjectModel(AuditLog.name)

        private readonly auditLogModel:
            Model<AuditLog>,
    ) { }

    async create(
        eventType: string,
        payload: any,
        timestamp: Date,
    ) {

        return this.auditLogModel.create({

            eventType,
            payload,
            timestamp,
        });
    }
}