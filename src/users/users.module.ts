import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET, JWT_VALIDITY } from 'src/common/constants';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_VALIDITY },
    }),
  ],
  exports: [SequelizeModule],
})
export class UsersModule {}
