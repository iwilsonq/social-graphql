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
    friends: [Int]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(id: Int!, input: CreateUserInput!): User
    deleteUser(id: Int!): User
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

      return Promise.all(source.friends.map(({ id }) => userModel.find(id)))
    }
  },
  Mutation: {
    createUser(source, args) {
      return userModel.create(args.input)
    },
    updateUser(source, args) {
      return userModel.update(args.id, args.input)
    },
    deleteUser(source, args) {
      return userModel.delete(args.id)
    }
  }
}
