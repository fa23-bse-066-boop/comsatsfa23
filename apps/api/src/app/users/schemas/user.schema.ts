import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus, TrustLevel, KycStatus } from '@dcms/shared-types';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ type: String, enum: Object.values(UserStatus), default: UserStatus.Active })
  status: UserStatus;

  @Prop({ type: String, enum: Object.values(TrustLevel), default: TrustLevel.Bronze })
  trustLevel: TrustLevel;

  @Prop({ type: String, enum: Object.values(KycStatus), default: KycStatus.NotSubmitted })
  kycStatus: KycStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
