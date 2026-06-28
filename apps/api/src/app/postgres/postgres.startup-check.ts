import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PostgresService } from './postgres.service';

@Injectable()
export class PostgresStartupCheck implements OnModuleInit {
  private readonly logger = new Logger(PostgresStartupCheck.name);

  constructor(private readonly postgresService: PostgresService) {}

  async onModuleInit(): Promise<void> {
    await this.postgresService.verifyConnectivity();
    this.logger.log('PostgreSQL startup check completed');
  }
}
