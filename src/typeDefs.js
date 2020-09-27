const { ApolloServer, gql } = require('apollo-server-express');

module.exports = gql`
    type Cat {
        id: ID!
        name: String!
        colour: String!
    }

    type Query {
        hello: String!
        cats(
            name: String
            colour: String
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