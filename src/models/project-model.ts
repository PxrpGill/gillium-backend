import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import slugify from "slugify";
import { UserModel } from "./user-model";
import { ProjectUserRoleModel } from "./project-user-role";
import { TaskColumnModel } from "./task-column-model";

@Entity()
export class ProjectModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => UserModel, (user) => user.projects, { eager: true })
  @JoinColumn({ name: "owner_id" })
  owner: UserModel;

  @OneToMany(() => ProjectUserRoleModel, (role) => role.project)
  userRoles: ProjectUserRoleModel[];

  @OneToMany(() => TaskColumnModel, (column) => column.project)
  columns: TaskColumnModel[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name, {
        lower: true,
        strict: true,
        trim: true,
      });
    }
  }
}
