import { createSchema, createYoga } from "graphql-yoga";
import { useGraphQlJit } from "@envelop/graphql-jit";
import { loadFiles } from "@graphql-tools/load-files";
import { resolvers } from "../shared/resolver.ts";

const yoga = createYoga({
  schema: createSchema({
    typeDefs: await loadFiles("../../schema.graphql"),
    resolvers,
  }),
  plugins: [useGraphQlJit()],
});

Deno.serve(yoga, {
  onListen({ hostname, port }: Deno.NetAddr) {
    console.log(
      `Listening on http://${hostname}:${port}/${yoga.graphqlEndpoint}`
    );
  },
});
