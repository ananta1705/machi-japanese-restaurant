import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export const MENU_CATEGORIES = [
  'Ramen',
  'Sushi',
  'Donburi',
  'Matcha',
  'Minuman',
  'Sampingan',
  'Dessert',
] as const;

export class CreateMenuDto {
  @IsString({ message: 'Nama menu harus berupa teks.' })
  @IsNotEmpty({ message: 'Nama menu tidak boleh kosong.' })
  @MinLength(3, { message: 'Nama menu minimal 3 karakter.' })
  name: string;

  @IsString({ message: 'Deskripsi menu harus berupa teks.' })
  @IsNotEmpty({ message: 'Deskripsi menu tidak boleh kosong.' })
  @MinLength(10, { message: 'Deskripsi menu minimal 10 karakter.' })
  description: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Harga menu harus berupa angka.' })
  @Min(1000, { message: 'Harga menu minimal Rp 1.000.' })
  price: number;

  @IsString({ message: 'Kategori menu harus berupa teks.' })
  @IsIn(MENU_CATEGORIES, {
    message: `Kategori harus salah satu dari: ${MENU_CATEGORIES.join(', ')}.`,
  })
  category: string;

  @IsOptional()
  @IsBoolean({ message: 'Status ketersediaan harus berupa boolean.' })
  isAvailable?: boolean;
}
