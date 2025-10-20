import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

const mockCategoriesService = {
  getAll: jest.fn(),
};

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of categories', async () => {
      const mockResult = [{ id: 1, name: 'Work', todos: [] }];
      mockCategoriesService.getAll.mockResolvedValue(mockResult);

      const result = await controller.getAll();

      expect(result).toEqual(mockResult);
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });
  });
});
