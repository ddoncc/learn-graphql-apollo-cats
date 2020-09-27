require('dotenv').config();

const { ApolloServer, gql } = require('apollo-server-express');
const { REPL_MODE_STRICT } = require('repl');
const Cat = require('./models/Cat');

module.exports = {
    Query: {
        hello: () => {
            return 'Hello';
        },
        cats: (_, req) => {
            return Cat.find(req);
        },
        cat: (_, req) => {
            return Cat.findOne({_id:req.id});
        }
    },

    Mutation: {
        createCat: (_, req) => {
            const newCat = new Cat({
                name: req.name,
                colour: req.colour
            });
            newCat.save();

            return newCat;
        },
        deleteCat: async (_, req) => {
            deleted = await Cat.deleteOne({_id: req.id}).then(err => {
                return err.deletedCount;
            });
            if (deleted == 0) return false;
            return true;
        }
    }
};