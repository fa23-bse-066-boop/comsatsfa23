import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('submit')
  async submitPayment(@Body() body: { committeeId: string; userId: string; amount: number; dueDate: string; method: string }) {
    try {
      const payment = await this.paymentService.createPayment(body, body.userId);
      return { success: true, data: payment, message: 'Payment submitted' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('user/:userId')
  async getUserPayments(@Param('userId') userId: string) {
    try {
      const payments = await this.paymentService.getPaymentsByUser(userId);
      return { success: true, data: payments };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('pending')
  async getPendingPayments() {
    try {
      const payments = await this.paymentService.getPendingPayments();
      return { success: true, data: payments };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post(':id/approve')
  async approvePayment(@Param('id') id: string, @Body() body: { adminId: string }) {
    try {
      const payment = await this.paymentService.approvePayment(id, body.adminId);
      return { success: true, data: payment, message: 'Payment approved' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post(':id/reject')
  async rejectPayment(@Param('id') id: string, @Body() body: { adminId: string; reason?: string }) {
    try {
      const payment = await this.paymentService.rejectPayment(id, body.adminId, body.reason);
      return { success: true, data: payment, message: 'Payment rejected' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post(':id/receipt')
  async submitReceipt(@Param('id') id: string, @Body() body: { receiptUrl: string; referenceNumber?: string }) {
    try {
      const payment = await this.paymentService.submitPaymentReceipt(id, body.receiptUrl, body.referenceNumber);
      return { success: true, data: payment, message: 'Receipt submitted' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
