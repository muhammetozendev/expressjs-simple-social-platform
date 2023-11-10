import { ConflictException } from '../../common/exceptions/conflict.exception';
import { UnauthorizedException } from '../../common/exceptions/unauthorized.exception';
import { UserRepository } from '../user/user.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { IActiveUser } from './types/active-user.interface';
import { env } from '../../config/env';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(data: LoginDto) {
    // Get the user
    const user = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    // Throw if user not found or password is incorrect
    if (!user) {
      throw new UnauthorizedException('Authentication failed');
    }
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Authentication failed');
    }

    // Sign the token and return it to the user
    const token = sign(
      {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
      } as IActiveUser,
      env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    return {
      token,
    };
  }

  async register(data: RegisterDto) {
    const found = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });
    if (found) {
      throw new ConflictException('User already exists');
    }
    data.password = await bcrypt.hash(data.password, 12);
    return await this.userRepository.save(data);
  }
}
