import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { JoinRequestService } from '../services/join-request.service';

@Controller('join-requests')
export class JoinRequestController {
  constructor(private joinRequestService: JoinRequestService) {}

  @Post('request')
  async requestJoin(@Body() body: { committeeId: string; userId: string }) {
    try {
      const request = await this.joinRequestService.requestJoin(body.committeeId, body.userId);
      return { success: true, data: request, message: 'Join request submitted' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('pending')
  async getPendingRequests() {
    try {
      const requests = await this.joinRequestService.getPendingRequests();
      return { success: true, data: requests };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post(':id/approve')
  async approveRequest(@Param('id') id: string, @Body() body: { adminId: string }) {
    try {
      const request = await this.joinRequestService.approveRequest(id, body.adminId);
      return { success: true, data: request, message: 'Request approved' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post(':id/reject')
  async rejectRequest(@Param('id') id: string, @Body() body: { adminId: string; reason?: string }) {
    try {
      const request = await this.joinRequestService.rejectRequest(id, body.adminId, body.reason);
      return { success: true, data: request, message: 'Request rejected' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
