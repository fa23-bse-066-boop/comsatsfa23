import { Controller, Post, Get, Param, Body, BadRequestException } from '@nestjs/common';
import { CommitteeService } from '../services/committee.service';

@Controller('committees')
export class CommitteeController {
  constructor(private committeeService: CommitteeService) {}

  @Post('create')
  async createCommittee(@Body() body: any) {
    try {
      const { name, description, monthlyAmount, totalMembers, duration, type, startDate, leaderId } = body;

      if (!name || !monthlyAmount || !totalMembers || !type || !leaderId) {
        throw new BadRequestException('Missing required fields');
      }

      const committee = await this.committeeService.createCommittee(
        { name, description, monthlyAmount, totalMembers, duration, type, startDate },
        leaderId,
      );

      return { success: true, data: committee, message: 'Committee created successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get()
  async getAllCommittees() {
    try {
      const committees = await this.committeeService.getAllCommittees();
      return { success: true, data: committees };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get(':id')
  async getCommitteeById(@Param('id') id: string) {
    try {
      const committee = await this.committeeService.getCommitteeById(id);
      return { success: true, data: committee };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post(':id/join')
  async joinCommittee(@Param('id') id: string, @Body() body: { userId: string }) {
    try {
      const committee = await this.committeeService.joinCommittee(id, body.userId);
      return { success: true, data: committee, message: 'Successfully joined committee' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    try {
      const committee = await this.committeeService.getCommitteeMembers(id);
      return { success: true, data: committee };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post(':id/pause')
  async pauseCommittee(@Param('id') id: string) {
    try {
      const committee = await this.committeeService.pauseCommittee(id);
      return { success: true, data: committee, message: 'Committee paused' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post(':id/close')
  async closeCommittee(@Param('id') id: string) {
    try {
      const committee = await this.committeeService.closeCommittee(id);
      return { success: true, data: committee, message: 'Committee closed' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('user/:userId')
  async getMyCommittees(@Param('userId') userId: string) {
    try {
      const committees = await this.committeeService.getMyCommittees(userId);
      return { success: true, data: committees };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
