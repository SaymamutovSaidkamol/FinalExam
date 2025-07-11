import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryMessageDto } from './dto/message-query.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
  async create(data: CreateCommentDto) {
    let checkBlogId = await this.prisma.blog.findFirst({
      where: { id: data.blogId },
    });

    if (!checkBlogId) {
      throw new NotFoundException('Blog Id invalide');
    }

    let new_Blog = await this.prisma.comment.create({ data });
    return { data: new_Blog };
  }

  async findAll(dto: QueryMessageDto) {
    try {
      const {
        blogId,
        message,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
      } = dto;

      const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
      const take = parseInt(String(limit));

      const where: any = {
        ...(blogId && {
          blogId: {
            contains: blogId,
            mode: 'insensitive',
          },
        }),
        ...(message && {
          message: {
            contains: message,
            mode: 'insensitive',
          },
        }),
      };

      const total = await this.prisma.comment.count({ where });

      const data = await this.prisma.comment.findMany({
        where,
        orderBy: {
          [sortBy]: order,
        },
        skip,
        take,
      });

      const totalPages = Math.ceil(total / take);

      return {
        data,
        total,
        page: Number(page),
        limit: take,
        totalPages,
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: string) {
    let checkBlog = await this.prisma.comment.findFirst({ where: { id } });

    if (!checkBlog) {
      throw new NotFoundException('Message not found');
    }

    return { data: checkBlog };
  }

  async update(id: string, data: UpdateCommentDto) {
    let checkBlog = await this.prisma.comment.findFirst({ where: { id } });

    if (!checkBlog) {
      throw new NotFoundException('Message not found');
    }

    if (data.blogId) {
      let checkBlogId = await this.prisma.blog.findFirst({
        where: { id: data.blogId },
      });

      if (!checkBlogId) {
        throw new NotFoundException('Blog Id invalide');
      }
    }

    let updateBlog = await this.prisma.comment.update({ where: { id }, data });

    return { data: updateBlog };
  }

  async remove(id: string) {
    let checkBlog = await this.prisma.comment.findFirst({ where: { id } });

    if (!checkBlog) {
      throw new NotFoundException('Message not found');
    }

    let delBlog = await this.prisma.comment.delete({ where: { id } });
    return { data: delBlog };
  }
}
