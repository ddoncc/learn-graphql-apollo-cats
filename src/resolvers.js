require('dotenv').config();

const { ApolloServer, gql } = require('apollo-server-express');
const { REPL_MODE_STRICT } = require('repl');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Cat = require('./models/Cat');
const User = require('./models/User');
const { processRequest } = require('graphql-upload');

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
        },

        users: (_, req) => {
            if (req.adminUser == process.env.ADMIN_USER && req.adminPass == process.env.ADMIN_PASS) {
                if (!req.username && !req.id) return User.find();
                if (req.id) return User.find({_id: req.id});
                if (req.username) return User.find({username: {$regex: `^${req.username}$`}});
            } 

            return [];
        }
    },

    Mutation: {
        register: async (_, req) => {
            const usernameCheck = await User.find({username: {$regex: `^${req.username}$`}});

            if (usernameCheck[0]) {
                return {
                    success: false,
                    msg: "Username is already taken"
                }
            }

            const newUser = new User({
                username: req.username,
                password: await bcrypt.hash(req.password, 10).then(hashed => {
                    return hashed
                })
            });

            newUser.save();

            const token = jwt.sign({ id: newUser._id, username: req.username }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXP });

            return {
                success: true,
                msg: "Successfully registered",
                id: newUser._id,
                username: req.username,
                token: token
            }
        },

        login: async (_, req) => {
            const user = await User.findOne({ username: req.username }).then(doc => doc)

            console.log(user.username);

            if (user.username == undefined) return {
                success: false,
                msg: "Invalid Username or Password"
            }

            const pass = bcrypt.compare(req.password, user.password).then((err, result) => {
                if (err) { console.log(err); return this.then(false) }
                return result
            })

            if (!pass) return {
                success: false,
                msg: "Invalid Username or Password"
            }

            const token = jwt.sign({ id: user._id, username: req.username }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXP });

            return {
                success: true,
                msg: `Successfully logged in as ${user.username}`,
                id: user._id,
                username: user.username,
                token: token
            }
        },

        createCat: (_, req) => {
            const decoded = jwt.verify(req.token, process.env.JWT_SECRET, (err, result) => {
                if (err) return err
                return result
            });

            if (decoded.username) {
                const newCat = new Cat({
                    name: req.name,
                    colour: req.colour
                });

                newCat.save();

                return {
                    authSuccess: true,
                    msg: `Successfully authorised as ${decoded.username}[${decoded.id}]`,
                    cat: newCat
                };
            }

            return {
                authSuccess: false,
                msg: decoded
            }
        },

        deleteCat: async (_, req) => {
            const decoded = jwt.verify(req.token, process.env.JWT_SECRET, (err, result) => {
                if (err) return err
                return result
            });

            if (decoded.username) {
                const deleted = await Cat.deleteOne({_id: req.id}).then(err => {
                    return err.deletedCount;
                });
                if (deleted == 0) return {
                    authSuccess: true,
                    msg: `Successfully authorised as ${decoded.username}[${decoded.id}]`,
                    deleted: false
                };
                return {
                    authSuccess: true,
                    msg: `Successfully authorised as ${decoded.username}[${decoded.id}]`,
                    deleted: true
                };
            }

            return {
                authSuccess: false,
                msg: "Failed to authorise"
            }
        }
    }
};