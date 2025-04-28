import Fastify from "fastify";
import mercurius from "mercurius";
import { resolvers } from "../shared/resolver.mjs";
import { readFileSync } from "node:fs";

const app = Fastify();

// load the schema from files using native node tools
const schema = readFileSync("../../schema.graphql", "utf8");

app.register(mercurius, {
  schema,
  resolvers,
});

app.get("/", async function (req, reply) {
  const query = "{ add(x: 2, y: 2) }";
  return reply.graphql(query);
});

app.listen({ port: 4000 });
