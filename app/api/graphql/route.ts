import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createYoga } from "graphql-yoga";
import { TaskResolver } from "@/server/todo/todo.resolver";
import { AuthResolver } from "@/server/auth/auth.resolver";
import { verifyToken } from "@/server/auth/jwt";

interface GraphQLContext {
  request: Request;
}

function getTokenFromRequest(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

const authChecker = ({ context }: { context: GraphQLContext }) => {
  const token = getTokenFromRequest(context.request);
  if (!token) return false;
  return verifyToken(token) !== null;
};

let schemaPromise: Promise<import("graphql").GraphQLSchema> | null = null;
let yogaInstance: ReturnType<typeof createYoga<Record<string, never>, GraphQLContext>> | null = null;

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
  if (!yogaInstance) {
    const schema = await getSchema();
    yogaInstance = createYoga<Record<string, never>, GraphQLContext>({
      schema,
      graphqlEndpoint: "/api/graphql",
      fetchAPI: { Response },
      context: ({ request }) => ({ request }),
    }) as ReturnType<typeof createYoga<Record<string, never>, GraphQLContext>>;
  }
  return yogaInstance;
}

export async function GET(request: Request) {
  try {
    const yoga = await getYoga();
    return (yoga.handleRequest as (request: Request) => Promise<Response>)(request);
  } catch (err) {
    console.error("[GraphQL] Error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const yoga = await getYoga();
    return (yoga.handleRequest as (request: Request) => Promise<Response>)(request);
  } catch (err) {
    console.error("[GraphQL] Error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function OPTIONS(request: Request) {
  try {
    const yoga = await getYoga();
    return (yoga.handleRequest as (request: Request) => Promise<Response>)(request);
  } catch (err) {
    console.error("[GraphQL] Error:", err);
    return new Response(null, { status: 500 });
  }
}
