import { compare, hash } from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';
import {
  BeforeCreate,
  Column,
  IsEmail,
  NotEmpty,
  PrimaryKey,
  AutoIncrement,
  DefaultScope,
  Table,
  Model,
} from 'sequelize-typescript';
import { HASH_ROUNDS } from 'src/common/constants';
import { UserRole } from 'src/common/enums/role.enum';

@Table({
  timestamps: true,
})

export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @IsEmail
  @NotEmpty
  @Column({ unique: true })
  email: string;

  @NotEmpty
  @Column({ unique: true })
  phone: string;

  @Column
  password: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    values: Object.values(UserRole),
  })
  role: UserRole;

  @DefaultScope(() => ({
    attributes: [
      'id',
      'firstName',
      'lastName',
      'email',
      'phone',
      'isActive',
      'role',
    ],
  }))


  @BeforeCreate
  static async hashPassword(instance: User) {
    instance.password = await hash(instance.password, HASH_ROUNDS);
  }

  async comparePassword(plainTextPassword: string): Promise<boolean> {
    const user = await User.scope({}).findOne({
      where: { id: this.id },
      attributes: ['password'],
    });
    return await compare(plainTextPassword, user.password);
  }
}
