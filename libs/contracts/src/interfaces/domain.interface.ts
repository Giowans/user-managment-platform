export interface DomainEvent<T> {

    eventType: string;

    payload: T;

    timestamp: Date;

    correlationId?: string;
}