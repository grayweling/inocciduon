// import bits that make the server go
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

// here is where the internal connections go
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

// create server stuff
const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve client/build as static in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes); ?

// create apollo server w graphql schema
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({ app });

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at https://localhost:${PORT}${server.graphqlPath}`);
        })
    })
}

// call function to start server
startApolloServer(typeDefs, resolvers);