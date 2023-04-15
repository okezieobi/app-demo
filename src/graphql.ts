import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

export const graphql_schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => "world",
      },
    },
  }),
});

export { createHandler } from "graphql-http/lib/use/express";
