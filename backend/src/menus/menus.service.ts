import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto.js';
import { UpdateMenuDto } from './dto/update-menu.dto.js';
import { Menu } from './entities/menu.entity.js';

@Injectable()
export class MenusService {
  private menus: Menu[] = [
    {
      id: 1,
      name: 'Signature Tonkotsu Ramen',
      description:
        'Kaldu kolagen rebusan 18 jam dengan chashu bakar lembut, telur ajitama, dan mi segar buatan fajar.',
      price: 58000,
      category: 'Ramen',
      isAvailable: true,
      createdAt: new Date('2026-11-01T10:00:00.000Z'),
    },
    {
      id: 2,
      name: 'Spicy Tantanmen Tokyo',
      description:
        'Kuah wijen pekat gurih berpadu chili oil aromatik buatan rumah dan daging cincang pedas.',
      price: 62000,
      category: 'Ramen',
      isAvailable: true,
      createdAt: new Date('2026-11-01T10:05:00.000Z'),
    },
    {
      id: 3,
      name: 'Uji Ceremonial Matcha Latte',
      description:
        'Ceremonial grade matcha asal Uji, Kyoto dikocok chasen bambu dengan susu segar.',
      price: 38000,
      category: 'Matcha',
      isAvailable: true,
      createdAt: new Date('2026-11-01T10:10:00.000Z'),
    },
    {
      id: 4,
      name: 'Crispy Pan-Fried Gyoza',
      description:
        'Pangsit isi ayam cincang dan kucai yang dipanggang garing dengan saus cuka hitam.',
      price: 34000,
      category: 'Sampingan',
      isAvailable: true,
      createdAt: new Date('2026-11-01T10:15:00.000Z'),
    },
  ];

  private nextId = 5;

  private ensureUniqueName(name: string, excludeId?: number): void {
    const normalized = name.trim().toLowerCase();
    const duplicate = this.menus.find(
      (menu) =>
        menu.name.trim().toLowerCase() === normalized && menu.id !== excludeId,
    );
    if (duplicate) {
      throw new ConflictException(
        `Menu dengan nama "${name.trim()}" sudah terdaftar.`,
      );
    }
  }

  create(createMenuDto: CreateMenuDto): Menu {
    this.ensureUniqueName(createMenuDto.name);

    const newMenu: Menu = {
      id: this.nextId++,
      name: createMenuDto.name.trim(),
      description: createMenuDto.description.trim(),
      price: createMenuDto.price,
      category: createMenuDto.category,
      isAvailable: createMenuDto.isAvailable ?? true,
      createdAt: new Date(),
    };

    this.menus.push(newMenu);
    return newMenu;
  }

  findAll(): Menu[] {
    return this.menus;
  }

  findOne(id: number): Menu {
    const menu = this.menus.find((item) => item.id === id);
    if (!menu) {
      throw new NotFoundException(`Menu dengan ID ${id} tidak ditemukan.`);
    }
    return menu;
  }

  update(id: number, updateMenuDto: UpdateMenuDto): Menu {
    const existing = this.findOne(id);

    if (updateMenuDto.name !== undefined) {
      this.ensureUniqueName(updateMenuDto.name, id);
      existing.name = updateMenuDto.name.trim();
    }
    if (updateMenuDto.description !== undefined) {
      existing.description = updateMenuDto.description.trim();
    }
    if (updateMenuDto.price !== undefined) {
      existing.price = updateMenuDto.price;
    }
    if (updateMenuDto.category !== undefined) {
      existing.category = updateMenuDto.category;
    }
    if (updateMenuDto.isAvailable !== undefined) {
      existing.isAvailable = updateMenuDto.isAvailable;
    }

    return existing;
  }

  remove(id: number): { message: string; data: Menu } {
    const index = this.menus.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Menu dengan ID ${id} tidak ditemukan.`);
    }

    const [deleted] = this.menus.splice(index, 1);
    return {
      message: `Menu dengan ID ${id} berhasil dihapus.`,
      data: deleted,
    };
  }
}
