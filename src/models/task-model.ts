import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { TaskColumnModel } from "./task-column-model";
import { UserModel } from "./user-model";
import { TaskStatusModel } from "./task-status-model";

@Entity()
export class TaskModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "int", nullable: true })
  estimatedTimeHours: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TaskColumnModel, (column) => column.tasks, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "column_id" })
  column: TaskColumnModel;

  @ManyToOne(() => UserModel, { eager: true })
  @JoinColumn({ name: "creator_id" })
  creator: UserModel;

  @ManyToOne(() => TaskStatusModel, { eager: true })
  @JoinColumn({ name: "status_id" })
  status: TaskStatusModel;
}
