import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CommitteeType, CommitteeStatus } from '@dcms/shared-types';

export type CommitteeDocument = Committee & Document;

@Schema({ timestamps: true })
export class Committee {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  monthlyAmount: number;

  @Prop({ required: true })
  totalMembers: number;

  @Prop({ default: 0 })
  currentMembers: number;

  @Prop({ required: true })
  duration: number; // months

  @Prop({ required: true, type: String, enum: Object.values(CommitteeType) })
  type: CommitteeType;

  @Prop({ default: CommitteeStatus.Draft, type: String, enum: Object.values(CommitteeStatus) })
  status: CommitteeStatus;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  leaderId: Types.ObjectId;

  @Prop({ default: false })
  isTrusted: boolean;

  @Prop({ default: 0 })
  lateFeeAmount: number;

  @Prop({ default: 0 })
  lateFeeGraceDays: number;

  @Prop({ default: false })
  requiresKyc: boolean;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: 0 })
  totalCollected: number;

  @Prop()
  nextPayoutDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  nextPayoutUserId?: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  members: Types.ObjectId[];
}

export const CommitteeSchema = SchemaFactory.createForClass(Committee);
