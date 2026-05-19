import {
    Injectable,
    OnModuleInit,
} from '@nestjs/common';

import {
    RabbitMQService,
} from '@shared/rabbitmq';

import {
    AuditLogsService,
} from './audit-logs.service';

@Injectable()
export class AuditConsumer
    implements OnModuleInit {
    constructor(
        private readonly rabbitmqService:
            RabbitMQService,
        private readonly auditLogsService: AuditLogsService,
    ) { }

    async onModuleInit() {

        await this.rabbitmqService.consume(

            'audit.queue',

            '#',

            async (event) => {

                console.log(
                    'EVENT RECEIVED:',
                    event,
                );

                // save in MongoDB
                await this.auditLogsService.create(

                    event.eventType ??
                    'unknown',

                    event,
                    event.timestamp,
                );
            },
        );
    }
}