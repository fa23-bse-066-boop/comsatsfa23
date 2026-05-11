import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CommitteeType, CommitteeStatus } from '@dcms/shared-types';

@Schema({ timestamps: true })
export class Committee extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  totalMembers: number;

  @Prop({ default: 0 })
  currentMembers: number;

  @Prop({ required: true })
  monthlyContribution: number;

  @Prop({ type: String, enum: Object.values(CommitteeType) })
  type: CommitteeType;

  @Prop({ type: String, enum: Object.values(CommitteeStatus), default: CommitteeStatus.Draft })
  status: CommitteeStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  adminIds: Types.ObjectId[];
}

export const CommitteeSchema = SchemaFactory.createForClass(Committee);
