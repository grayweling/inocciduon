// bring in the dancing lobsters!
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// now DANCE
const resolvers = {
    Query: {
        // get all users
        users: async () => {
            return User.find()
                .select('-__v -password');
        },
        // get a single user
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password');
        },
        // get logged in user
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password');
                return userData;
            }
            throw new AuthenticationError('Not logged in!');
        }
    },
    Mutation: {
        // add a user
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { user, token };
        },
        // log in
        login: async (parent, { username, password }) => {
            const user = await User.findOne({ username });
            const correctPw = await user.isCorrectPassword(password);

            if (!user || !correctPw) {
                throw new AuthenticationError('Username or password is incorrect.');
            }

            const token = signToken(user);
            return { token, user };
        }
    }
}

module.exports = resolvers;