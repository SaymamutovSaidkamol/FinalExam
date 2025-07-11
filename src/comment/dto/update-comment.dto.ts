import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    example: 'uuid()',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  blogId?: string;

  @ApiProperty({
    example: 'Blog haqida message',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  message?: string;
}
