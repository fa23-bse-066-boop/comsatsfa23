import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostgresNote } from './entities/postgres-note.entity';

@Injectable()
export class PostgresService {
  private readonly logger = new Logger(PostgresService.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(PostgresNote)
    private readonly postgresNoteRepository: Repository<PostgresNote>,
  ) {}

  async verifyConnectivity(): Promise<void> {
    await this.dataSource.query('SELECT 1');
    this.logger.log('PostgreSQL connectivity check passed');
  }

  async health() {
    const [{ now }] = await this.dataSource.query(
      "SELECT NOW()::text AS now",
    ) as Array<{ now: string }>;

    return {
      status: 'ok',
      databaseTime: now,
      database: this.dataSource.options.type,
    };
  }

  async createNote(title: string, content: string): Promise<PostgresNote> {
    const note = this.postgresNoteRepository.create({ title, content });
    return this.postgresNoteRepository.save(note);
  }

  async listNotes(): Promise<PostgresNote[]> {
    return this.postgresNoteRepository.find({
      order: { id: 'DESC' },
    });
  }

  async getNote(id: number): Promise<PostgresNote> {
    const note = await this.postgresNoteRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException(`Postgres note with id ${id} was not found`);
    }

    return note;
  }

  async updateNote(
    id: number,
    title: string | undefined,
    content: string | undefined,
  ): Promise<PostgresNote> {
    const note = await this.getNote(id);

    if (title !== undefined) {
      note.title = title;
    }

    if (content !== undefined) {
      note.content = content;
    }

    return this.postgresNoteRepository.save(note);
  }

  async deleteNote(id: number): Promise<{ deleted: boolean }> {
    const result = await this.postgresNoteRepository.delete(id);

    return { deleted: (result.affected ?? 0) > 0 };
  }
}
