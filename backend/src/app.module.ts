import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MenusModule } from './menus/menus.module.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [MenusModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
