import SourceAPI from '../graphql/dataSource/api'

const sourceAPI = new SourceAPI()

export const resolvers = {
  Query: {
    policyholder: async (_, { code }) => {
      return await sourceAPI.getPolicyholderDetail(code)
    },
  },
  Mutation: {
  },
};
