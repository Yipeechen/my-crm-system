import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';

import typeDefs from '../../graphql/typeDefs';
import { resolvers } from '../../graphql/resolvers';

const apolloServer = new ApolloServer({ typeDefs, resolvers });

const createHandler = async () => {
  return startServerAndCreateNextHandler(apolloServer, {
    context: async (req) => ({ req }),
  });
};

let handler: ReturnType<typeof startServerAndCreateNextHandler>;

export async function GET(request: NextRequest) {
  if (!handler) {
    handler = await createHandler();
  }
  return handler(request);
}

export async function POST(request: NextRequest) {
  if (!handler) {
    handler = await createHandler();
  }
  return handler(request);
}
