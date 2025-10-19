import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, categoryId: number, status: Status) {
    const count = await this.prisma.todo.count({
      where: { categoryId },
    });

    if (count >= 5) {
      throw new BadRequestException('A category may contain at most 5 tasks');
    }

    return this.prisma.todo.create({
      data: { name, categoryId, status },
    });
  }

  async getAll(category?: number) {
    return this.prisma.todo.findMany({
      where: category ? { categoryId: category } : {},
      include: { category: true },
    });
  }

  async update(id: number, status: Status) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new NotFoundException('Todo not found');

    return this.prisma.todo.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: number) {
    await this.prisma.todo.delete({ where: { id } });
    return { message: 'Todo deleted successfully' };
  }
}
