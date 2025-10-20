import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Status } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany({});
    await prisma.category.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/categories', () => {
    it('GET /categories -> should return an array of categories', async () => {
      await prisma.category.create({
        data: { name: 'Work' },
      });

      const response = await request(app.getHttpServer()).get('/categories');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('name', 'Work');
    });
  });

  describe('/todos', () => {
    let defaultCategory;

    beforeEach(async () => {
      defaultCategory = await prisma.category.create({
        data: { name: 'Personal' },
      });
    });

    it('POST /todos -> should create a new todo', async () => {
      const createTodoDto = {
        name: 'Buy milk',
        categoryId: defaultCategory.id,
        status: Status.NOTDONE,
      };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .send(createTodoDto);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createTodoDto.name);

      const todosInDb = await prisma.todo.findMany({});
      expect(todosInDb.length).toBe(1);
    });

    it('POST /todos -> should fail with 400 if category has 5 todos', async () => {
      for (let i = 0; i < 5; i++) {
        await prisma.todo.create({
          data: {
            name: `Task ${i + 1}`,
            categoryId: defaultCategory.id,
            status: Status.NOTDONE,
          },
        });
      }

      const createTodoDto = {
        name: 'The 6th Task',
        categoryId: defaultCategory.id,
        status: Status.NOTDONE,
      };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .send(createTodoDto);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        'A category may contain at most 5 tasks',
      );
    });

    it('GET /todos -> should return all todos', async () => {
      await prisma.todo.create({
        data: {
          name: 'First task',
          categoryId: defaultCategory.id,
          status: Status.NOTDONE,
        },
      });

      const response = await request(app.getHttpServer()).get('/todos');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('First task');
    });

    it('GET /todos?category=:id -> should return filtered todos', async () => {
      const otherCategory = await prisma.category.create({
        data: { name: 'Work' },
      });

      await prisma.todo.create({
        data: {
          name: 'Personal task',
          categoryId: defaultCategory.id,
          status: Status.NOTDONE,
        },
      });
      await prisma.todo.create({
        data: {
          name: 'Work task',
          categoryId: otherCategory.id,
          status: Status.NOTDONE,
        },
      });

      const response = await request(app.getHttpServer()).get(
        `/todos?category=${defaultCategory.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Personal task');
    });

    it('PATCH /todos/:id -> should update a todo status', async () => {
      const todo = await prisma.todo.create({
        data: {
          name: 'To be updated',
          categoryId: defaultCategory.id,
          status: Status.NOTDONE,
        },
      });

      const updateDto = { status: Status.DONE };

      const response = await request(app.getHttpServer())
        .patch(`/todos/${todo.id}`)
        .send(updateDto);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(Status.DONE);

      const updatedTodoInDb = await prisma.todo.findUnique({
        where: { id: todo.id },
      });
      expect(updatedTodoInDb.status).toBe(Status.DONE);
    });

    it('DELETE /todos/:id -> should delete a todo', async () => {
      const todo = await prisma.todo.create({
        data: {
          name: 'To be deleted',
          categoryId: defaultCategory.id,
          status: Status.NOTDONE,
        },
      });

      const response = await request(app.getHttpServer()).delete(
        `/todos/${todo.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Todo deleted successfully');

      const todoInDb = await prisma.todo.findUnique({ where: { id: todo.id } });
      expect(todoInDb).toBeNull();
    });
  });
});
