import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AuditLog {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  userEmail!: string;

  @Prop()
  role?: string;

  @Prop({ required: true })
  eventType!: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata?: any;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
