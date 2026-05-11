import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Committee, CommitteeDocument } from '../schemas/committee.schema';
import { CommitteeStatus } from '@dcms/shared-types';

@Injectable()
export class CommitteeService {
  constructor(
    @InjectModel(Committee.name) private committeeModel: Model<CommitteeDocument>,
  ) {}

  async createCommittee(data: any, leaderId: string): Promise<CommitteeDocument> {
    const committee = new this.committeeModel({
      ...data,
      leaderId: new Types.ObjectId(leaderId),
      members: [new Types.ObjectId(leaderId)], // Leader is first member
      currentMembers: 1,
      status: CommitteeStatus.Active,
      startDate: new Date(data.startDate),
    });
    return committee.save();
  }

  async getAllCommittees(): Promise<CommitteeDocument[]> {
    return this.committeeModel.find({ status: CommitteeStatus.Active }).exec();
  }

  async getCommitteeById(id: string): Promise<CommitteeDocument> {
    const committee = await this.committeeModel.findById(id).exec();
    if (!committee) {
      throw new NotFoundException(`Committee ${id} not found`);
    }
    return committee;
  }

  async joinCommittee(committeeId: string, userId: string): Promise<CommitteeDocument> {
    const committee = await this.getCommitteeById(committeeId);

    if (committee.currentMembers >= committee.totalMembers) {
      throw new BadRequestException('Committee is full');
    }

    const userId_obj = new Types.ObjectId(userId);

    // Check if already member
    if (committee.members.some(m => m.equals(userId_obj))) {
      throw new BadRequestException('User is already a member');
    }

    // Add member
    committee.members.push(userId_obj);
    committee.currentMembers += 1;

    return committee.save();
  }

  async getMyCommittees(userId: string): Promise<CommitteeDocument[]> {
    const userId_obj = new Types.ObjectId(userId);
    return this.committeeModel
      .find({ members: userId_obj })
      .exec();
  }

  async pauseCommittee(id: string): Promise<CommitteeDocument> {
    const committee = await this.getCommitteeById(id);
    committee.status = CommitteeStatus.Paused;
    return committee.save();
  }

  async closeCommittee(id: string): Promise<CommitteeDocument> {
    const committee = await this.getCommitteeById(id);
    committee.status = CommitteeStatus.Closed;
    return committee.save();
  }

  async getCommitteeMembers(id: string) {
    const committee = await this.getCommitteeById(id);
    return this.committeeModel
      .findById(id)
      .populate('members')
      .exec();
  }
}
