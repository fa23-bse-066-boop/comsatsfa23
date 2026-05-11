import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payout, PayoutDocument } from '../schemas/payout.schema';
import { PayoutStatus } from '@dcms/shared-types';

@Injectable()
export class PayoutService {
  constructor(
    @InjectModel(Payout.name) private payoutModel: Model<PayoutDocument>,
  ) {}

  async createPayout(data: any): Promise<PayoutDocument> {
    const payout = new this.payoutModel({
      ...data,
      userId: new Types.ObjectId(data.userId),
      committeeId: new Types.ObjectId(data.committeeId),
      status: PayoutStatus.Scheduled,
      scheduledDate: new Date(data.scheduledDate),
    });
    return payout.save();
  }

  async getPayoutsByUser(userId: string): Promise<PayoutDocument[]> {
    return this.payoutModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('committeeId')
      .exec();
  }

  async getPayoutById(id: string): Promise<PayoutDocument> {
    const payout = await this.payoutModel.findById(id).exec();
    if (!payout) {
      throw new NotFoundException(`Payout ${id} not found`);
    }
    return payout;
  }

  async getScheduledPayouts(): Promise<PayoutDocument[]> {
    return this.payoutModel
      .find({ status: PayoutStatus.Scheduled })
      .populate('userId')
      .populate('committeeId')
      .exec();
  }

  async releasePayout(id: string, adminId: string): Promise<PayoutDocument> {
    const payout = await this.getPayoutById(id);

    if (payout.status !== PayoutStatus.Scheduled) {
      throw new BadRequestException('Payout is not scheduled');
    }

    payout.status = PayoutStatus.Released;
    payout.releasedBy = new Types.ObjectId(adminId);
    payout.releasedDate = new Date();

    return payout.save();
  }

  async holdPayout(id: string, adminId: string, reason?: string): Promise<PayoutDocument> {
    const payout = await this.getPayoutById(id);

    if (![PayoutStatus.Scheduled, PayoutStatus.Released].includes(payout.status)) {
      throw new BadRequestException('Cannot hold this payout');
    }

    payout.status = PayoutStatus.Held;
    if (reason) {
      payout.adminNote = reason;
    }

    return payout.save();
  }

  async completePayout(id: string): Promise<PayoutDocument> {
    const payout = await this.getPayoutById(id);

    if (payout.status !== PayoutStatus.Released) {
      throw new BadRequestException('Payout is not released');
    }

    payout.status = PayoutStatus.Completed;
    return payout.save();
  }

  async getPayoutsByStatus(status: string): Promise<PayoutDocument[]> {
    return this.payoutModel
      .find({ status: status as any })
      .populate('userId')
      .populate('committeeId')
      .exec();
  }
}
