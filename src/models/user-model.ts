import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import bcrypt from "bcrypt";
import { ProjectModel } from "./project-model";
import { ProjectUserRoleModel } from "./project-user-role";
import { Exclude } from "class-transformer";

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @OneToMany(() => ProjectModel, (project) => project.owner)
  projects: ProjectModel[];

  @OneToMany(() => ProjectUserRoleModel, (role) => role.user)
  projectRoles: ProjectUserRoleModel[];

  async setPassword(password: string) {
    const saltRounds = 10;
    this.passwordHash = await bcrypt.hash(password, saltRounds);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}
