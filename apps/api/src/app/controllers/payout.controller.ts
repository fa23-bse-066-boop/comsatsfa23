import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { PayoutService } from '../services/payout.service';

@Controller('payouts')
export class PayoutController {
  constructor(private payoutService: PayoutService) {}

  @Get('user/:userId')
  async getUserPayouts(@Param('userId') userId: string) {
    try {
      const payouts = await this.payoutService.getPayoutsByUser(userId);
      return { success: true, data: payouts };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('scheduled')
  async getScheduledPayouts() {
    try {
      const payouts = await this.payoutService.getScheduledPayouts();
      return { success: true, data: payouts };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post(':id/release')
  async releasePayout(@Param('id') id: string, @Body() body: { adminId: string }) {
    try {
      const payout = await this.payoutService.releasePayout(id, body.adminId);
      return { success: true, data: payout, message: 'Payout released' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post(':id/hold')
  async holdPayout(@Param('id') id: string, @Body() body: { adminId: string; reason?: string }) {
    try {
      const payout = await this.payoutService.holdPayout(id, body.adminId, body.reason);
      return { success: true, data: payout, message: 'Payout held' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post(':id/complete')
  async completePayout(@Param('id') id: string) {
    try {
      const payout = await this.payoutService.completePayout(id);
      return { success: true, data: payout, message: 'Payout completed' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
