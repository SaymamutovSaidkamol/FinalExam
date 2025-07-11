import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryBlogDto } from './dto/blog-query.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
  async create(data: CreateBlogDto) {
    let new_Blog = await this.prisma.blog.create({ data });

    return { data: new_Blog };
  }

  async findAll(dto: QueryBlogDto) {
    try {
      const {
        title,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
      } = dto;

      const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
      const take = parseInt(String(limit));

      const where: any = {
        ...(title && {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        }),
      };

      const total = await this.prisma.blog.count({ where });

      const data = await this.prisma.blog.findMany({
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
    let checkBlog = await this.prisma.blog.findFirst({ where: { id } });

    if (!checkBlog) {
      throw new NotFoundException('Blog not found');
    }

    return { data: checkBlog };
  }

  async update(id: string, data: UpdateBlogDto) {
    let checkBlog = await this.prisma.blog.findFirst({ where: { id } });

    if (!checkBlog) {
      throw new NotFoundException('Blog not found');
    }

    let updateBlog = await this.prisma.blog.update({ where: { id }, data });

    return { data: updateBlog };
  }

  async remove(id: string) {
    let checkBlog = await this.prisma.blog.findFirst({ where: { id } });

    if (!checkBlog) {
      throw new NotFoundException('Blog not found');
    }

    let delBlog = await this.prisma.blog.delete({ where: { id } });
    return { data: delBlog };
  }
}
