import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({
  timestamps: true,
})
export class AuditLog {

  @Prop({
    required: true,
  })
  eventType!: string;

  @Prop({
    type: Object,

    required: true,
  })
  payload!: Record<string, any>;

  @Prop({
    required: true,
  })
  timestamp!: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
