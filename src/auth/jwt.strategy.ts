import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
  });
  }
  async validate(payload: any) {
    console.log('JWT Payload received:', payload);
    const { id } = payload;
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      console.log(
        'User found in JWT strategy:',
        user ? `ID: ${user.id}, Name: ${user.name}` : 'No user found',
      );
      if (!user) {
        throw new UnauthorizedException('Login first to access this endpoint');
      }

      // Return the user object that will be attached to req.user
      const userToAttach = { ...user };
      console.log('User object being attached to request:', userToAttach);
      return userToAttach;
    } catch (error) {
      console.error('JWT validation error:', error.message);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
