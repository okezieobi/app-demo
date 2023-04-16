import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import logger from "debug";
import { GraphQLError, GraphQLTypeResolver } from "graphql";

import { UserFeatures } from "./features";
import { initConnection } from "./services";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

   scalar Object

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).

  type Query {
    hello: String
  }


  type Mutation {
     insertUser(email: String!): Object
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
  Mutation: {
    insertUser: async (val: unknown, ctx: { email: string }) => {
      return new UserFeatures({ email: ctx.email })
        .insertOne()
        .catch((error: Error) => {
          throw new GraphQLError(error.message, {
            extensions: {
              code: error.constructor.name ?? error.name,
              originalError: error,
            },
          });
        });
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
initConnection().then(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
  });
  const debug = logger("graphql-app-demo:server");
  debug(`🚀  Server ready at: ${url}`);
});
