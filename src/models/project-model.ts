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
