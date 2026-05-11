import { Controller, Get, Post, Body } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get()
  getState() {
    return this.syncService.getState();
  }

  @Post()
  saveState(@Body() state: any) {
    return this.syncService.saveState(state);
  }
}
