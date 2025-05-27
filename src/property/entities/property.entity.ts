import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  // Make the owner relationship optional by adding nullable: true
  @ManyToOne(() => User, { nullable: true })
  owner: User;

  // You might also want to add a column for the owner ID if you're referencing it directly
  @Column({ nullable: true })
  ownerId: string;
}
