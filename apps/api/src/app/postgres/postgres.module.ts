import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresNote } from './entities/postgres-note.entity';
import { buildPostgresDataSourceOptions } from './postgres.config';
import { PostgresController } from './postgres.controller';
import { PostgresService } from './postgres.service';
import { PostgresStartupCheck } from './postgres.startup-check';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...buildPostgresDataSourceOptions(),
        retryAttempts: 3,
        retryDelay: 2000,
      }),
    }),
    TypeOrmModule.forFeature([PostgresNote]),
  ],
  controllers: [PostgresController],
  providers: [PostgresService, PostgresStartupCheck],
})
export class PostgresModule {}
