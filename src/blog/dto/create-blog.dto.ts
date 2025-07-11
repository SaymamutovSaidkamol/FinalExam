import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    example: 'Blog nomi',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Blog haqida',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
