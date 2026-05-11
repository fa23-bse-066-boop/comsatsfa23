import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JoinRequestDocument = JoinRequest & Document;

@Schema({ timestamps: true })
export class JoinRequest {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Committee' })
  committeeId: Types.ObjectId;

  @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Rejected', 'Waitlisted'] })
  status: string;

  @Prop({ default: false })
  riskFlag: boolean;

  @Prop()
  riskReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewNote?: string;

  @Prop()
  reviewedAt?: Date;
}

export const JoinRequestSchema = SchemaFactory.createForClass(JoinRequest);
