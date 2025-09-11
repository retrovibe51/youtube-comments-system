import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { users } from 'src/database/schema';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { ResponseTypeDTO } from 'src/common/dtos/response/response-type.dto';
import { User } from 'src/common/types';
import { Pagination } from 'src/common/dtos/response/pagination.dto';
import { sql } from 'drizzle-orm';
import { GetUserListDto } from './dtos/request/get-user-list.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: NodePgDatabase,
  ) {}

  async getUsers(
    getVideoListDto: GetUserListDto,
  ): Promise<ResponseTypeDTO<{ list: User[]; pagination: Pagination }>> {
    try {
      const { pageNo, limit } = getVideoListDto;

      const offset = (pageNo - 1) * limit;
      const userList = await this.db.select().from(users);

      const count = await this.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(users)
        .then((res) => res[0]?.count ?? 0);

      const pagination: Pagination = {
        limit,
        pageNo,
        numberOfPages: Math.ceil(count / limit),
        totalItemCount: Number(count),
      };

      return {
        status: HttpStatus.OK,
        message: 'Fetched user list.',
        data: { list: userList, pagination },
      };
    } catch (error) {
      throw new HttpException(
        'There was an error on fetching the user list.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<ResponseTypeDTO<void>> {
    try {
      await this.db.insert(users).values(createUserDto);

      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully.',
      };
    } catch (error) {
      throw new HttpException(
        'There was an error on creating the user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
