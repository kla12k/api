import { User } from '@/auth/entities/user.entity';
import { ProfessionType } from '../entities/profession.entity';

export class ProfessionResponseDto {
  id: string;
  name: string;
  professionType: ProfessionType;
  biography?: string;
  location?: string;
  contact?: string;
  specialties?: string[];
  image?: string;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
