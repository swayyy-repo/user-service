import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from 'src/common/enums/role.enum';
import { LoginUserDto } from './dto/login-user.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto, role: UserRole) {
    const user = new User({ ...createUserDto, isActive: true, role: role });
    await user.save();
    return user;
  }

  async findOne(id: number) {
    const user: User = await User.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: username }, { phone: username }],
      },
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findOneWithUsernameAndPassword(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.findOneByUsername(username);
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      throw new UnauthorizedException(`Wrong username or password`);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
