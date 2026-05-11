import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Committee } from './schemas/committee.schema';

@Injectable()
export class CommitteesService {
  constructor(@InjectModel(Committee.name) private committeeModel: Model<Committee>) {}

  async create(createCommitteeDto: any): Promise<Committee> {
    const createdCommittee = new this.committeeModel(createCommitteeDto);
    return createdCommittee.save();
  }

  async findAll(): Promise<Committee[]> {
    return this.committeeModel.find().exec();
  }

  async findOne(id: string): Promise<Committee | null> {
    return this.committeeModel.findById(id).exec();
  }

  async update(id: string, updateCommitteeDto: any): Promise<Committee | null> {
    return this.committeeModel.findByIdAndUpdate(id, updateCommitteeDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Committee | null> {
    return this.committeeModel.findByIdAndDelete(id).exec();
  }
}
