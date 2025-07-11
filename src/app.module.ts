import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BlogModule } from './blog/blog.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [PrismaModule, BlogModule, CommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
