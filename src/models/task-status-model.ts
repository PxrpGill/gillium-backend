import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TaskModel } from "./task-model";
import { ProjectModel } from "./project-model";

@Entity()
export class TaskStatusModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => ProjectModel, (project) => project.statuses, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "project_id" }) // создаёт колонку в БД
  project: ProjectModel;

  @OneToMany(() => TaskModel, (task) => task.status)
  tasks: TaskModel[];
}
