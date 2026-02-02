import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import { buildSchema } from "type-graphql";
import { createYoga } from "graphql-yoga";
import { TaskResolver } from "./_todo/todo.resolver";
import { AuthResolver } from "./_auth/auth.resolver";
import type { GraphQLContext } from "./_auth/auth.resolver";
import { verifyToken } from "./_auth/jwt";

function getTokenFromRequest(req: GraphQLContext["req"]): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

const authChecker = ({ context }: { context: GraphQLContext }) => {
  const token = getTokenFromRequest(context.req);
  if (!token) return false;
  return verifyToken(token) !== null;
};

export const config = {
  api: { bodyParser: false },
};

let schemaPromise: Promise<import("graphql").GraphQLSchema> | null = null;
let yoga: ReturnType<typeof createYoga> | null = null;

async function getSchema() {
  if (!schemaPromise) {
    schemaPromise = buildSchema({
      resolvers: [TaskResolver, AuthResolver],
      validate: false,
      authChecker,
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
    return yogaInstance.handle(req, res, { req, res });
  }
}
