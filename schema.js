import { gql } from 'apollo-server-express'
import userModel from './models'

export const typeDefs = gql`
  type User {
    id: ID
    name: String
    age: Int
    email: String
    friends: [User]
  }

  type Query {
    users: [User]
  }

  input CreateUserInput {
    id: Int
    name: String
    age: Int
    email: String
    friendIds: [Int]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
  }

`

export const resolvers = {
  Query: {
    users() {
      return userModel.list()
    }
  },
  User: {
    friends(source) {
      if (!source.friends || !source.friends.length) {
        return
      }

      return Promise.all(
        source.friends.map(({ id }) => userModel.find(id))
      )
    }
  },
  Mutation: {
    createUser(source, args) {
      return userModel.create(args.input)
    }
  }
}
