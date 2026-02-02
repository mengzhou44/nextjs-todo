import "reflect-metadata";
import { GraphQLBoolean, GraphQLString } from "graphql";
import { Resolver, Mutation, Arg, ID, Authorized } from "type-graphql";
import { TaskType } from "./todo.dto";
import { createTask, updateTask, deleteTask } from "./todo.service";

@Resolver(TaskType)
@Authorized()
export class TaskResolver {
  @Mutation(() => TaskType)
  async createTask(@Arg("title") title: string): Promise<TaskType> {
    return createTask(title);
  }

  @Mutation(() => TaskType, { nullable: true })
  async updateTask(
    @Arg("id", () => ID) id: string,
    @Arg("title", () => GraphQLString, { nullable: true }) title: string | undefined,
    @Arg("completed", () => GraphQLBoolean, { nullable: true }) completed: boolean | undefined
  ): Promise<TaskType | null> {
    return updateTask(id, { title, completed });
  }

  @Mutation(() => Boolean)
  async deleteTask(@Arg("id", () => ID) id: string): Promise<boolean> {
    return deleteTask(id);
  }
}
