import { Test, TestingModule } from '@nestjs/testing';
import { MenusController } from './menus.controller.js';
import { MenusService } from './menus.service.js';

describe('MenusController', () => {
  let controller: MenusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenusController],
      providers: [MenusService],
    }).compile();

    controller = module.get<MenusController>(MenusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
