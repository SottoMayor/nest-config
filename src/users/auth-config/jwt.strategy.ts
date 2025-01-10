import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { userId } = payload;

    const User: User = await this.UsersRepository.findOneBy({id: userId});

    if (!User) {
      throw new UnauthorizedException();
    }

    return User;
  }
}