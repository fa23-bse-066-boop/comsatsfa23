import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JoinRequest, JoinRequestDocument } from '../schemas/join-request.schema';
import { CommitteeService } from './committee.service';

@Injectable()
export class JoinRequestService {
  constructor(
    @InjectModel(JoinRequest.name) private joinRequestModel: Model<JoinRequestDocument>,
    private committeeService: CommitteeService,
  ) {}

  async requestJoin(committeeId: string, userId: string): Promise<JoinRequestDocument> {
    // Check if committee exists
    await this.committeeService.getCommitteeById(committeeId);

    // Check if already requested
    const existing = await this.joinRequestModel.findOne({
      committeeId: new Types.ObjectId(committeeId),
      userId: new Types.ObjectId(userId),
      status: { $in: ['Pending', 'Approved'] },
    });

    if (existing) {
      throw new BadRequestException('User already requested or joined this committee');
    }

    const joinRequest = new this.joinRequestModel({
      userId: new Types.ObjectId(userId),
      committeeId: new Types.ObjectId(committeeId),
      status: 'Pending',
      riskFlag: false,
    });

    return joinRequest.save();
  }

  async getPendingRequests(): Promise<JoinRequestDocument[]> {
    return this.joinRequestModel
      .find({ status: 'Pending' })
      .populate('userId')
      .populate('committeeId')
      .exec();
  }

  async getRequestById(id: string): Promise<JoinRequestDocument> {
    const request = await this.joinRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException(`Join request ${id} not found`);
    }
    return request;
  }

  async approveRequest(id: string, adminId: string): Promise<JoinRequestDocument> {
    const request = await this.getRequestById(id);

    if (request.status !== 'Pending') {
      throw new BadRequestException('Request is not pending');
    }

    // Add user to committee
    await this.committeeService.joinCommittee(
      request.committeeId.toString(),
      request.userId.toString(),
    );

    request.status = 'Approved';
    request.reviewedBy = new Types.ObjectId(adminId);
    request.reviewedAt = new Date();

    return request.save();
  }

  async rejectRequest(
    id: string,
    adminId: string,
    reason?: string,
  ): Promise<JoinRequestDocument> {
    const request = await this.getRequestById(id);

    if (request.status !== 'Pending') {
      throw new BadRequestException('Request is not pending');
    }

    request.status = 'Rejected';
    request.reviewedBy = new Types.ObjectId(adminId);
    request.reviewedAt = new Date();
    if (reason) {
      request.reviewNote = reason;
    }

    return request.save();
  }

  async flagRisk(id: string, reason: string): Promise<JoinRequestDocument> {
    const request = await this.getRequestById(id);
    request.riskFlag = true;
    request.riskReason = reason;
    return request.save();
  }

  async getRequestsByCommittee(committeeId: string): Promise<JoinRequestDocument[]> {
    return this.joinRequestModel
      .find({ committeeId: new Types.ObjectId(committeeId) })
      .populate('userId')
      .exec();
  }
}
