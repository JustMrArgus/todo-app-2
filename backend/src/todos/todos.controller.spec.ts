import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Status } from '@prisma/client';

const mockTodosService = {
  create: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockTodo = {
  id: 1,
  name: 'Test Todo',
  categoryId: 1,
  status: Status.NOTDONE,
};

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoDto: CreateTodoDto = {
        name: 'Test Todo',
        categoryId: 1,
        status: Status.NOTDONE,
      };

      mockTodosService.create.mockResolvedValue(mockTodo);

      const result = await controller.create(createTodoDto);

      expect(result).toEqual(mockTodo);
      expect(service.create).toHaveBeenCalledWith(
        createTodoDto.name,
        createTodoDto.categoryId,
        createTodoDto.status,
      );
    });
  });

  describe('getAll', () => {
    it('should get all todos without category filter', async () => {
      mockTodosService.getAll.mockResolvedValue([mockTodo]);

      const result = await controller.getAll(undefined);

      expect(result).toEqual([mockTodo]);
      expect(service.getAll).toHaveBeenCalledWith(undefined);
    });

    it('should get todos with category filter', async () => {
      mockTodosService.getAll.mockResolvedValue([mockTodo]);

      const result = await controller.getAll('1');

      expect(result).toEqual([mockTodo]);
      expect(service.getAll).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoDto: UpdateTodoDto = { status: Status.DONE };
      const updatedTodo = { ...mockTodo, status: Status.DONE };

      mockTodosService.update.mockResolvedValue(updatedTodo);

      const result = await controller.update(1, updateTodoDto);

      expect(result).toEqual(updatedTodo);
      expect(service.update).toHaveBeenCalledWith(1, updateTodoDto.status);
    });
  });

  describe('delete', () => {
    it('should delete a todo', async () => {
      const deleteResponse = { message: 'Todo deleted successfully' };
      mockTodosService.delete.mockResolvedValue(deleteResponse);

      const result = await controller.delete(1);

      expect(result).toEqual(deleteResponse);
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
