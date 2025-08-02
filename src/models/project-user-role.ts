import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./user-model";
import { ProjectModel } from "./project-model";

@Entity()
export class ProjectUserRoleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserModel, (user) => user.projectRoles)
  user: UserModel;

  @ManyToOne(() => ProjectModel, (project) => project.userRoles)
  project: ProjectModel;

  @Column()
  role: "owner" | "admin" | "member";
}
