import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Committee, CommitteeSchema } from './schemas/committee.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Payout, PayoutSchema } from './schemas/payout.schema';
import { JoinRequest, JoinRequestSchema } from './schemas/join-request.schema';
import { User, UserSchema } from './schemas/user.schema';

import { CommitteeService } from './services/committee.service';
import { PaymentService } from './services/payment.service';
import { PayoutService } from './services/payout.service';
import { JoinRequestService } from './services/join-request.service';

import { CommitteeController } from './controllers/committee.controller';
import { PaymentController } from './controllers/payment.controller';
import { PayoutController } from './controllers/payout.controller';
import { JoinRequestController } from './controllers/join-request.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env['MONGODB_URI'] || 'mongodb://localhost:27017/dcms',
      {
        serverSelectionTimeoutMS: 5000,
      },
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Committee.name, schema: CommitteeSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Payout.name, schema: PayoutSchema },
      { name: JoinRequest.name, schema: JoinRequestSchema },
    ]),
  ],
  controllers: [
    AppController,
    CommitteeController,
    PaymentController,
    PayoutController,
    JoinRequestController,
  ],
  providers: [
    AppService,
    CommitteeService,
    PaymentService,
    PayoutService,
    JoinRequestService,
  ],
})
export class AppModule {}
