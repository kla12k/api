// import {
//   Injectable,
//   ConflictException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcryptjs';
// import { SignUpDto } from './dto/signup.dto';
// import { LoginDto } from './dto/login.dto';
// import { User } from './entities/user.entity';
// import { UserRoles } from './enums/user-roles.enum';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private jwtService: JwtService,
//   ) {}

//   // Register User
//   async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
//     const { name, email, password, role } = signUpDto;
//     // Check if user already exists
//     const existingUser = await this.userRepository.findOne({
//       where: { email },
//     });
//     if (existingUser) {
//       throw new ConflictException('Duplicate Email entered.');
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//       const user = this.userRepository.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: role || UserRoles.USER,
//       });
//       await this.userRepository.save(user);
//       const token = this.assignJwtToken(Number(user.id));
//       return { token };
//     } catch (error) {
//       throw new ConflictException('Error creating user');
//     }
//   }

//   // Login user
//   async login(loginDto: LoginDto): Promise<{ token: string }> {
//     const { email, password } = loginDto;
//     const user = await this.userRepository.findOne({
//       where: { email },
//       select: ['id', 'email', 'password', 'role'],
//     });
//     if (!user) {
//       throw new UnauthorizedException('Invalid email address or password.');
//     }
//     // Check if password is correct or not
//     const isPasswordMatched = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatched) {
//       throw new UnauthorizedException('Invalid email address or password.');
//     }
//     const token = this.assignJwtToken(Number(user.id));
//     return { token };
//   }

//   // Helper method to assign JWT token
//   assignJwtToken(userId: number): string {
//     const payload = { id: userId };
//     return this.jwtService.sign(payload, {
//       expiresIn: '1h', // Explicitly set to 1 hour
//     });
//   }
// }

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UserRoles } from './enums/user-roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password, role } = signUpDto;
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      throw new ConflictException('Duplicate Email entered.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password during signup:', hashedPassword);
    try {
      const user = this.userRepository.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: role || UserRoles.USER,
      });
      await this.userRepository.save(user);
      console.log('User saved:', user);
      const token = this.assignJwtToken(Number(user.id));
      return { token };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new ConflictException('Error creating user');
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
      select: ['id', 'email', 'password', 'role'],
    });
    if (!user) {
      console.log('User not found for email:', normalizedEmail);
      throw new UnauthorizedException('Invalid email address or password.');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isPasswordMatched);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email address or password.');
    }
    const token = this.assignJwtToken(Number(user.id));
    return { token };
  }

  assignJwtToken(userId: number): string {
    const payload = { id: userId };
    return this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'role'], // Exclude password
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
