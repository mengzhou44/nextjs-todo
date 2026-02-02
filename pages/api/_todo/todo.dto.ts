import "reflect-metadata";
import { ObjectType, Field, ID } from "type-graphql";
import type { Task } from "@/types/task";

export type { Task };

@ObjectType()
export class TaskType implements Task {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  completed!: boolean;

  @Field()
  createdAt!: string;
}
