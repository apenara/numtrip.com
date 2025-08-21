import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean, IsNumber, MinLength, MaxLength } from 'class-validator';
import { Category } from '@prisma/client';

export class UpdateBusinessDto {
  @ApiProperty({ example: 'Hotel Cartagena Plaza', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: 'Luxury hotel in the heart of Cartagena', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ enum: Category, example: Category.HOTEL, required: false })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiProperty({ example: 'Cartagena', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  city?: string;

  @ApiProperty({ example: 'Calle 1 #2-3, Centro Histórico', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @ApiProperty({ example: 10.4236, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: -75.5378, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: '+57 5 664 9494', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 'info@hotelcartagena.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+57 300 123 4567', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  whatsapp?: string;

  @ApiProperty({ example: 'https://hotelcartagena.com', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}