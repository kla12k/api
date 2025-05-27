import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum ProfessionType {
  DOCTOR = 'doctor',
  LAWYER = 'lawyer',
  ENGINEER = 'engineer',
  TEACHER = 'teacher',
  ACCOUNTANT = 'accountant',
  OTHER = 'other',
}

@Entity('professions')
export class Profession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ProfessionType,
    default: ProfessionType.OTHER,
  })
  professionType: ProfessionType;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  contact: string;

  @Column('simple-array', { nullable: true })
  specialties: string[];

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User, (user) => user.professions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
