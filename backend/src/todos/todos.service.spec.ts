import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';

const mockPrismaService = {
  todo: {
    count: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockTodo = {
  id: 1,
  name: 'Test Todo',
  categoryId: 1,
  status: Status.NOTDONE,
};

describe('TodosService', () => {
  let service: TodosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo if count < 5', async () => {
      mockPrismaService.todo.count.mockResolvedValue(4);
      mockPrismaService.todo.create.mockResolvedValue(mockTodo);

      const result = await service.create('Test Todo', 1, Status.NOTDONE);

      expect(result).toEqual(mockTodo);
      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: { name: 'Test Todo', categoryId: 1, status: Status.NOTDONE },
      });
      expect(prisma.todo.count).toHaveBeenCalledWith({
        where: { categoryId: 1 },
      });
    });

    it('should throw BadRequestException if count >= 5', async () => {
      mockPrismaService.todo.count.mockResolvedValue(5);

      await expect(
        service.create('Test Todo', 1, Status.NOTDONE),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.todo.create).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return all todos if no category is provided', async () => {
      const mockTodos = [mockTodo, { ...mockTodo, id: 2, categoryId: 2 }];
      mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);

      const result = await service.getAll();

      expect(result).toEqual(mockTodos);
      expect(prisma.todo.findMany).toHaveBeenCalledWith({
        where: {},
        include: { category: true },
      });
    });

    it('should return todos for a specific category if provided', async () => {
      const mockTodos = [mockTodo];
      mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);

      const result = await service.getAll(1);

      expect(result).toEqual(mockTodos);
      expect(prisma.todo.findMany).toHaveBeenCalledWith({
        where: { categoryId: 1 },
        include: { category: true },
      });
    });
  });

  describe('update', () => {
    it('should update a todo status if it exists', async () => {
      const updatedTodo = { ...mockTodo, status: Status.DONE };

      mockPrismaService.todo.findUnique.mockResolvedValue(mockTodo);
      mockPrismaService.todo.update.mockResolvedValue(updatedTodo);

      const result = await service.update(1, Status.DONE);

      expect(result).toEqual(updatedTodo);
      expect(prisma.todo.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: Status.DONE },
      });
    });

    it('should throw NotFoundException if todo to update is not found', async () => {
      mockPrismaService.todo.findUnique.mockResolvedValue(null);

      await expect(service.update(99, Status.DONE)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.todo.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a todo and return a success message', async () => {
      mockPrismaService.todo.delete.mockResolvedValue(mockTodo);

      const result = await service.delete(1);

      expect(result).toEqual({ message: 'Todo deleted successfully' });
      expect(prisma.todo.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if prisma fails to delete', async () => {
      const dbError = new Error('Record not found');
      mockPrismaService.todo.delete.mockRejectedValue(dbError);

      await expect(service.delete(99)).rejects.toThrow('Record not found');
    });
  });
});
