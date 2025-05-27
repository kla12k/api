// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   OneToMany,
//   JoinColumn,
// } from 'typeorm';
// import { User } from '../../auth/entities/user.entity';
// import { Category } from '../../category/entities/category.entity';
// import { Review } from '../../review/entities/review.entity';

// @Entity('businesses')
// export class Business {
//   @PrimaryGeneratedColumn()
//   id: string;

//   @Column()
//   name: string;

//   @Column({ nullable: true })
//   description: string;

//   @Column({ nullable: true })
//   address: string;

//   @Column({ nullable: true })
//   phone: string;

//   @Column({ nullable: true })
//   email: string;

//   @Column({ nullable: true })
//   website: string;

//   @Column({ nullable: true })
//   image: string;

//   @ManyToOne(() => User, (user) => user.businesses)
//   @JoinColumn({ name: 'ownerId' })
//   owner: User;

//   @Column()
//   ownerId: string;

//   @ManyToOne(() => Category, (category) => category.businesses)
//   @JoinColumn({ name: 'categoryId' })
//   category: Category;

//   @Column()
//   categoryId: string;

//   @OneToMany(() => Review, (review) => review.business)
//   reviews: Review[];

//   @Column({ default: true })
//   isActive: boolean;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date;

//   @Column({
//     type: 'timestamp',
//     default: () => 'CURRENT_TIMESTAMP',
//     onUpdate: 'CURRENT_TIMESTAMP',
//   })
//   updatedAt: Date;
// }
// src/business/entities/business.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../auth/entities/user.entity';
import { Review } from '../../review/entities/review.entity';

// Simplified example of what your entity might need
@Entity()
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  image: string;

  @Column()
  ownerId: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => User)
  owner: User;

  @OneToMany(() => Review, (review) => review.business)
  reviews: Review[];
}
