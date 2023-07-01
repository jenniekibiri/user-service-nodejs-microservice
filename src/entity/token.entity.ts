import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  expired_at: Date;
}
