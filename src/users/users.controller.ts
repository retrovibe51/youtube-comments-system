import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { ResponseTypeDTO } from 'src/common/dtos/response/response-type.dto';
import { User } from 'src/common/types';
import { GetUserListDto } from './dtos/request/get-user-list.dto';
import { Pagination } from 'src/common/dtos/response/pagination.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query() getUserListDto: GetUserListDto,
  ): Promise<ResponseTypeDTO<{ list: User[]; pagination: Pagination }>> {
    return await this.usersService.getUsers(getUserListDto);
  }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseTypeDTO<void>> {
    return this.usersService.createUser(createUserDto);
  }
}
