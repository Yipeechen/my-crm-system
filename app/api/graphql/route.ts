import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import typeDefs from '../../graphql/typeDefs';
import { resolvers } from '../../graphql/resolvers';

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false
  }
}

const handler = await startServerAndCreateNextHandler(apolloServer);

export { handler as GET, handler as POST };
