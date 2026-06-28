import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostgresService } from './postgres.service';

type NotePayload = {
  title?: string;
  content?: string;
};

@Controller('postgres')
export class PostgresController {
  constructor(private readonly postgresService: PostgresService) {}

  @Get('health')
  getHealth() {
    return this.postgresService.health();
  }

  @Post('notes')
  createNote(@Body() payload: NotePayload) {
    const title = payload.title?.trim();
    const content = payload.content?.trim();

    if (!title || !content) {
      throw new BadRequestException('title and content are required');
    }

    return this.postgresService.createNote(title, content);
  }

  @Get('notes')
  listNotes() {
    return this.postgresService.listNotes();
  }

  @Get('notes/:id')
  getNote(@Param('id', ParseIntPipe) id: number) {
    return this.postgresService.getNote(id);
  }

  @Patch('notes/:id')
  updateNote(@Param('id', ParseIntPipe) id: number, @Body() payload: NotePayload) {
    const hasTitle = payload.title !== undefined;
    const hasContent = payload.content !== undefined;

    if (!hasTitle && !hasContent) {
      throw new BadRequestException('At least one of title or content is required');
    }

    const title = hasTitle ? payload.title?.trim() : undefined;
    const content = hasContent ? payload.content?.trim() : undefined;

    if ((hasTitle && !title) || (hasContent && !content)) {
      throw new BadRequestException('title and content cannot be empty');
    }

    return this.postgresService.updateNote(id, title, content);
  }

  @Delete('notes/:id')
  deleteNote(@Param('id', ParseIntPipe) id: number) {
    return this.postgresService.deleteNote(id);
  }
}
