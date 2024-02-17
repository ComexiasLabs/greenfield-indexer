import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@graphql/schema';
import resolvers from '@graphql/resolvers';

const apolloServer = new ApolloServer({ typeDefs, resolvers });

const startServer = apolloServer.start();

export default async function handler(req, res) {
  await startServer;
  return apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
