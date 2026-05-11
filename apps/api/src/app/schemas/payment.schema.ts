import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentStatus, PaymentMethod } from '@dcms/shared-types';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Committee' })
  committeeId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  dueDate: Date;

  @Prop()
  paidDate?: Date;

  @Prop({ required: true, type: String, enum: Object.values(PaymentMethod) })
  method: PaymentMethod;

  @Prop()
  receiptUrl?: string;

  @Prop()
  referenceNumber?: string;

  @Prop({ default: PaymentStatus.Pending, type: String, enum: Object.values(PaymentStatus) })
  status: PaymentStatus;

  @Prop({ default: 0 })
  lateFeeApplied?: number;

  @Prop()
  adminNote?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop()
  approvedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
