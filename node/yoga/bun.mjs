import { createSchema } from "graphql-yoga";
import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";

import { useGraphQlJit } from "@envelop/graphql-jit";
import { loadFiles } from "@graphql-tools/load-files";
import { resolvers } from "../shared/resolver.mjs";

// Create a schema with the typeDefs loaded from the file
export const schema = createSchema({
  resolvers,
  typeDefs: await loadFiles("../../schema.graphql"),
});

const yoga = createYoga({ schema, plugins: [useGraphQlJit()] });

const server = Bun.serve({
  fetch: yoga,
});

console.info(
  `Server is running on ${new URL(
    yoga.graphqlEndpoint,
    `http://${server.hostname}:${server.port}`
  )}`
);
