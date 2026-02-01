import "reflect-metadata";
import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { TaskType } from "./todo.dto";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "./todo.service";

@Resolver(TaskType)
export class TaskResolver {
  @Query(() => [TaskType])
  async tasks(): Promise<TaskType[]> {
    return getTasks();
  }

  @Query(() => TaskType, { nullable: true })
  async task(@Arg("id", () => ID) id: string): Promise<TaskType | null> {
    return getTask(id);
  }

  @Mutation(() => TaskType)
  async createTask(@Arg("title") title: string): Promise<TaskType> {
    return createTask(title);
  }

  @Mutation(() => TaskType, { nullable: true })
  async updateTask(
    @Arg("id", () => ID) id: string,
    @Arg("title", { nullable: true }) title?: string,
    @Arg("completed", { nullable: true }) completed?: boolean
  ): Promise<TaskType | null> {
    return updateTask(id, { title, completed });
  }

  @Mutation(() => Boolean)
  async deleteTask(@Arg("id", () => ID) id: string): Promise<boolean> {
    return deleteTask(id);
  }
}
