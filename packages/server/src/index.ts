import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { MeterResolver } from "./resolvers/MeterReadingResolver";
import * as path from "path";

async function main() {
  await createConnection();
  const schema = await buildSchema({
    resolvers: [MeterResolver],
    emitSchemaFile: path.join(__dirname, "schema/schema.graphql"),
  });
  const server = new ApolloServer({ schema });
  await server.listen(4000);
  console.log("Server has started!");
}
main();
