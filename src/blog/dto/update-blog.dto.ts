import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBlogDto {
  @ApiProperty({
    example: 'Blog nomi',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({
    example: 'Blog haqida',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description?: string;
}
