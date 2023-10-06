import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { UniqueConstraintExceptionFilter } from 'src/common/exceptions/unique-constraint.exception';
import { APP_FILTER } from '@nestjs/core';
import { OtpsModule } from 'src/otps/otps.module';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'shubham@123',
      database: 'TEST',
      models: [User],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    OtpsModule,
    ProfilesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: UniqueConstraintExceptionFilter,
    },
  ],
})
export class AppModule {}
