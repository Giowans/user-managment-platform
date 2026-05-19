import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';

import * as amqp from 'amqplib';

import {
    AUDIT_EXCHANGE,
} from './rabbitmq.constants';

@Injectable()
export class RabbitMQService
    implements OnModuleInit, OnModuleDestroy {
    private connection!: amqp.ChannelModel;

    private channel!: amqp.Channel;

    private isConnected = false;

    async onModuleInit() {

        this.connectWithRetry();
    }

    async onModuleDestroy() {

        await this.channel.close();

        await this.connection.close();
    }

    private async connectWithRetry() {

        const maxRetries = 10;

        let retries = 0;

        while (retries < maxRetries) {

            try {

                this.connection =
                    await amqp.connect(
                        process.env.RABBITMQ_URL!,
                    );

                this.channel =
                    await this.connection.createChannel();

                await this.channel.assertExchange(
                    AUDIT_EXCHANGE,
                    'topic',
                    {
                        durable: true,
                    },
                );

                this.isConnected = true;

                console.log(
                    '✅ RabbitMQ connected',
                );

                return;

            } catch (error) {

                retries++;

                console.log(
                    `RabbitMQ connection failed. Retry ${retries}/${maxRetries}`,
                );

                await new Promise(
                    resolve =>
                        setTimeout(resolve, 5000),
                );
            }
        }

        throw new Error(
            'Failed to connect to RabbitMQ',
        );
    }

    async publish(
        routingKey: string,
        message: unknown,
    ) {

        this.channel.publish(
            AUDIT_EXCHANGE,
            routingKey,

            Buffer.from(
                JSON.stringify(message),
            ),
        );
    }

    async consume(
        queue: string,
        routingKey: string,
        callback: (
            message: any,
        ) => Promise<void>,
    ) {

        await this.waitForConnection();

        await this.channel.assertQueue(
            queue,
            {
                durable: true,
            },
        );

        await this.channel.bindQueue(
            queue,
            AUDIT_EXCHANGE,
            routingKey,
        );

        this.channel.consume(
            queue,

            async (msg) => {

                if (!msg) return;

                try {

                    const content =
                        JSON.parse(
                            msg.content.toString(),
                        );

                    await callback(content);

                    this.channel.ack(msg);

                } catch (error) {

                    console.error(error);

                    this.channel.nack(msg);
                }
            },
        );
    }

    private async waitForConnection() {

        while (!this.isConnected) {

            console.log(
                'Waiting for RabbitMQ connection...',
            );

            await new Promise(
                resolve =>
                    setTimeout(resolve, 1000),
            );
        }
    }
}