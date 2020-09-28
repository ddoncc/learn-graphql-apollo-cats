const { ApolloServer, gql } = require('apollo-server-express');

module.exports = gql`
    type Cat {
        id: ID!
        name: String!
        colour: String!
        date: String!
    }

    type User {
        id: ID!
        username: String!
        date: String!
    }

    type RegisterLoginResponse {
        success: Boolean!
        msg: String!
        id: ID
        username: String
        token: String
    }

    type CreateResponse {
        authSuccess: Boolean!
        msg: String!
        cat: Cat
    }

    type DeleteResponse {
        authSuccess: Boolean!
        msg: String!
        deleted: Boolean
    }


    type Query {
        hello: String!

        cats(
            name: String
            colour: String
            date: String
        ): [Cat!]!

        cat(
            id: ID!
        ): Cat!

        users(
            adminUser: String!
            adminPass: String!

            id: ID
            username: String
        ): [User]
    },

    type Mutation{
        register(
            username: String!
            password: String!
        ): RegisterLoginResponse!

        login(
            username: String!
            password: String!
        ): RegisterLoginResponse

        createCat(
            token: String!
            name: String!
            colour: String!
        ): CreateResponse

        deleteCat(
            token: String!
            id: ID!
        ): DeleteResponse

    }
`;