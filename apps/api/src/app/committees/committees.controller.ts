import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CommitteesService } from './committees.service';

@Controller('committees')
export class CommitteesController {
  constructor(private readonly committeesService: CommitteesService) {}

  @Post()
  create(@Body() createCommitteeDto: any) {
    return this.committeesService.create(createCommitteeDto);
  }

  @Get()
  findAll() {
    return this.committeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.committeesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommitteeDto: any) {
    return this.committeesService.update(id, updateCommitteeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.committeesService.remove(id);
  }
}
