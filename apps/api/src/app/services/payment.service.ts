import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from '../schemas/payment.schema';
import { PaymentStatus } from '@dcms/shared-types';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async createPayment(data: any, userId: string): Promise<PaymentDocument> {
    const payment = new this.paymentModel({
      ...data,
      userId: new Types.ObjectId(userId),
      committeeId: new Types.ObjectId(data.committeeId),
      status: PaymentStatus.Pending,
      dueDate: new Date(data.dueDate),
    });
    return payment.save();
  }

  async getPaymentsByUser(userId: string): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('committeeId')
      .exec();
  }

  async getPaymentById(id: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }
    return payment;
  }

  async getPendingPayments(): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find({ status: PaymentStatus.Pending })
      .populate('userId')
      .populate('committeeId')
      .exec();
  }

  async approvePayment(id: string, adminId: string): Promise<PaymentDocument> {
    const payment = await this.getPaymentById(id);

    if (payment.status !== PaymentStatus.Pending) {
      throw new BadRequestException('Payment is not pending');
    }

    payment.status = PaymentStatus.Approved;
    payment.approvedBy = new Types.ObjectId(adminId);
    payment.approvedAt = new Date();
    payment.paidDate = new Date();

    return payment.save();
  }

  async rejectPayment(id: string, adminId: string, reason?: string): Promise<PaymentDocument> {
    const payment = await this.getPaymentById(id);

    if (payment.status !== PaymentStatus.Pending) {
      throw new BadRequestException('Payment is not pending');
    }

    payment.status = PaymentStatus.Rejected;
    payment.approvedBy = new Types.ObjectId(adminId);
    payment.approvedAt = new Date();
    if (reason) {
      payment.adminNote = reason;
    }

    return payment.save();
  }

  async submitPaymentReceipt(
    id: string,
    receiptUrl: string,
    referenceNumber?: string,
  ): Promise<PaymentDocument> {
    const payment = await this.getPaymentById(id);
    payment.receiptUrl = receiptUrl;
    if (referenceNumber) {
      payment.referenceNumber = referenceNumber;
    }
    return payment.save();
  }

  async getPaymentsByStatus(status: string): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find({ status: status as any })
      .populate('userId')
      .populate('committeeId')
      .exec();
  }
}
