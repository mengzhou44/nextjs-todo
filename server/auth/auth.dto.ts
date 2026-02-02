import "reflect-metadata";
import { ObjectType, Field } from "type-graphql";

@ObjectType({ name: "LoginResponse" })
export class LoginResponse {
  @Field()
  accessToken!: string;
}
