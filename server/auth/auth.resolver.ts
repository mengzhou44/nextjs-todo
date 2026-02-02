import "reflect-metadata";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import type { NextApiRequest, NextApiResponse } from "next";
import { validateCredentials } from "./credentials";
import { signToken } from "./jwt";
import { LoginResponse } from "./auth.dto";

export interface GraphQLContext {
  req: NextApiRequest;
  res: NextApiResponse;
}

@Resolver()
export class AuthResolver {
  @Query(() => String)
  ping(): string {
    return "pong";
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<LoginResponse> {
    if (!validateCredentials(email, password)) {
      throw new Error("Invalid email or password");
    }
    const accessToken = signToken({ email });
    return { accessToken };
  }
}
