import { Module } from '@nestjs/common';
import { MenusService } from './menus.service.js';
import { MenusController } from './menus.controller.js';

@Module({
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
