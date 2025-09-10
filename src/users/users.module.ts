import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DrizzleModule } from 'src/database/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
