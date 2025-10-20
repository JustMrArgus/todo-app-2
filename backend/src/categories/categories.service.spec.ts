import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  category: {
    findMany: jest.fn(),
  },
};

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of categories with todos', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Work',
          todos: [{ id: 1, name: 'Finish report', status: 'NOTDONE' }],
        },
        { id: 2, name: 'Home', todos: [] },
      ];

      mockPrismaService.category.findMany.mockResolvedValue(mockCategories);

      const result = await service.getAll();

      expect(result).toEqual(mockCategories);
      expect(prisma.category.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        include: { todos: true },
      });
    });
  });
});
