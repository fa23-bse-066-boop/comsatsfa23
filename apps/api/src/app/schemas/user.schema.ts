import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus, TrustLevel, KycStatus } from '@dcms/shared-types';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ default: UserStatus.Active, type: String, enum: Object.values(UserStatus) })
  status: UserStatus;

  @Prop({ default: TrustLevel.Bronze, type: String, enum: Object.values(TrustLevel) })
  trustLevel: TrustLevel;

  @Prop({ default: KycStatus.NotSubmitted, type: String, enum: Object.values(KycStatus) })
  kycStatus: KycStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
