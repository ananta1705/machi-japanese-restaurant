import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  qty: number;
}

export class CreateOrderDto {
  @IsString({ message: 'Nama pemesan harus berupa teks.' })
  @IsNotEmpty({ message: 'Nama pemesan tidak boleh kosong.' })
  @MinLength(2, { message: 'Nama pemesan minimal 2 karakter.' })
  customerName: string;

  @IsString({ message: 'Nomor telepon/WhatsApp harus berupa teks.' })
  @IsNotEmpty({ message: 'Nomor telepon/WhatsApp wajib diisi.' })
  @MinLength(8, { message: 'Nomor telepon/WhatsApp minimal 8 digit.' })
  phone: string;

  @IsString()
  @IsIn(['meja', 'ambil', 'antar'], {
    message: 'Metode pengambilan harus meja, ambil, atau antar.',
  })
  method: string;

  @IsOptional()
  @IsString()
  tableNo?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  @IsNotEmpty({ message: 'Metode pembayaran wajib dipilih.' })
  paymentMethod: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray({ message: 'Daftar item pesanan harus berupa array.' })
  @ArrayMinSize(1, { message: 'Pesanan minimal berisi 1 menu.' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
