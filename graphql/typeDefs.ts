import { gql } from '@apollo/client'

const typeDefs = gql`
  type Policyholder {
    code: ID!
    name: String!
    registration_date: String!
    introducer_code: String
    l: [Policyholder]
    r: [Policyholder]
  }

  type Query {
    policyholder (code: String): Policyholder!
  }

  type Mutation {
    createPolicyholder(name: String!, email: String!): Policyholder!
  }
`;

export default typeDefs
