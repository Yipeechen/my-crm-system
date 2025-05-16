import { Resolvers } from '@apollo/client';

import SourceAPI from './dataSource/api'

const sourceAPI = new SourceAPI()

export const resolvers: Resolvers = {
  Query: {
    policyholder: async (_, { code }: { code: string }) => {
      return await sourceAPI.getPolicyholderDetail(code)
    },
  },
  Mutation: {
  },
};
