import { OmitType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class ResponseUserDto extends OmitType(User, []) {}
