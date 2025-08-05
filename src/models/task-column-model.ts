// models/task-column-model.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ProjectModel } from "./project-model";
import { TaskModel } from "./task-model";

@Entity()
export class TaskColumnModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => ProjectModel, (project) => project.columns, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "project_id" })
  project: ProjectModel;

  @OneToMany(() => TaskModel, (task) => task.column)
  tasks: TaskModel[];
}
