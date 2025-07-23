import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import bcrypt from "bcrypt";

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  async setPassword(password: string) {
    const saltRounds = 10;
    this.passwordHash = await bcrypt.hash(password, saltRounds);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}
