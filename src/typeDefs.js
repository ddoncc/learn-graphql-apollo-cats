const { ApolloServer, gql } = require('apollo-server-express');

module.exports = gql`
    type Cat {
        id: ID!
        name: String!
        colour: String!
        date: String!
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
    },

    type Mutation{
        createCat(
            name: String!
            colour: String!
        ): Cat!
        deleteCat(
            id: ID!
        ): Boolean!
    }
`;