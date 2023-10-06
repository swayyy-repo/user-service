import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/common/enums/role.enum';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { string_encryption } from 'src/common/utils/auth.utils';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto, UserRole.USER);
  }

  @Post('authenticate')
  @HttpCode(HttpStatus.OK) 
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user =
      await this.usersService.findOneWithUsernameAndPassword(loginUserDto);
    const payload = {
      sub: await string_encryption('' + user.id),
    };
    const response: LoginResponseDto = {
      authToken: await this.jwtService.signAsync(payload),
    };
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findOne(@Request() req) {
    return await this.usersService.findOne(req.user_id);
  }

  @Patch('/Change')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
