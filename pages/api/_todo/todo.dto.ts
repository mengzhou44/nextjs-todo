import "reflect-metadata";
import { ObjectType, Field, ID } from "type-graphql";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

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
