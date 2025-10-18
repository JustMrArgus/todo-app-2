import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() body: CreateTodoDto) {
    return this.todosService.create(body.name, body.categoryId, body.status);
  }

  @Get()
  getAll(@Query('category') category?: string) {
    return this.todosService.getAll(category ? Number(category) : undefined);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTodoDto) {
    return this.todosService.update(
      id,
      body.status,
      body.name,
      body.categoryId,
    );
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.delete(id);
  }
}
