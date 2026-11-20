import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Order, OrderItem } from './entities/order.entity.js';

@Injectable()
export class OrdersService {
  private readonly dataFilePath = path.join(process.cwd(), 'data', 'orders.json');
  private orders: Order[] = [];
  private nextId = 1;

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const raw = fs.readFileSync(this.dataFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.orders = parsed;
          const maxId = this.orders.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
          this.nextId = maxId + 1;
        }
      }
    } catch {
      this.orders = [];
      this.nextId = 1;
    }
  }

  private saveToDisk(): void {
    const dir = path.dirname(this.dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.dataFilePath, JSON.stringify(this.orders, null, 2), 'utf-8');
  }

  create(createOrderDto: CreateOrderDto): Order {
    const id = this.nextId++;
    const orderCode = `MCH-${String(id).padStart(4, '0')}`;

    const items: OrderItem[] = createOrderDto.items.map((item) => ({
      name: item.name.trim(),
      price: item.price,
      qty: item.qty,
      subtotal: item.price * item.qty,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    const newOrder: Order = {
      id,
      orderCode,
      customerName: createOrderDto.customerName.trim(),
      phone: createOrderDto.phone.trim(),
      method: createOrderDto.method,
      tableNo: createOrderDto.tableNo?.trim() || undefined,
      address: createOrderDto.address?.trim() || undefined,
      paymentMethod: createOrderDto.paymentMethod,
      notes: createOrderDto.notes?.trim() || undefined,
      items,
      totalAmount,
      status: 'DIPROSES',
      createdAt: new Date(),
    };

    this.orders.unshift(newOrder);
    this.saveToDisk();
    return newOrder;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: number): Order {
    const order = this.orders.find((item) => item.id === id);
    if (!order) {
      throw new NotFoundException(`Pesanan dengan ID ${id} tidak ditemukan.`);
    }
    return order;
  }
}
