import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import { buildSchema } from "type-graphql";
import { createYoga } from "graphql-yoga";
import { TaskResolver } from "./_todo/todo.resolver";

export const config = {
  api: { bodyParser: false },
};

let schemaPromise: Promise<import("graphql").GraphQLSchema> | null = null;
let yoga: ReturnType<typeof createYoga> | null = null;

async function getSchema() {
  if (!schemaPromise) {
    schemaPromise = buildSchema({
      resolvers: [TaskResolver],
      validate: false,
    });
  }
  return schemaPromise;
}

async function getYoga() {
  if (!yoga) {
    const schema = await getSchema();
    yoga = createYoga({
      schema,
      graphqlEndpoint: "/api/graphql",
    });
  }
  return yoga;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const yogaInstance = await getYoga();
  if (yogaInstance) {
    return yogaInstance.handle(req, res);
  }
}
