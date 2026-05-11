import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PayoutStatus, PaymentMethod } from '@dcms/shared-types';

export type PayoutDocument = Payout & Document;

@Schema({ timestamps: true })
export class Payout {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Committee' })
  committeeId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  position: number; // turn number

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop()
  releasedDate?: Date;

  @Prop({ required: true, type: String, enum: Object.values(PaymentMethod) })
  method: PaymentMethod;

  @Prop({ default: PayoutStatus.Scheduled, type: String, enum: Object.values(PayoutStatus) })
  status: PayoutStatus;

  @Prop()
  proofUrl?: string;

  @Prop()
  adminNote?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  releasedBy?: Types.ObjectId;
}

export const PayoutSchema = SchemaFactory.createForClass(Payout);
