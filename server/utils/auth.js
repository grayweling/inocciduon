// add web token
const jwt = require('jsonwebtoken');

// create secret and timed expiration
const secret = 'artemesia';
const expiration = '4h';

// export
module.exports = {
    // add a token to a browser to track user logins
    signToken: function ({ username, _id }) {
        const payload = { username, _id };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
    // authentication middleware
    authMiddleware: function ({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // separate "Bearer" from "<tokenvalue>"
        if (req.headers.authorization) {
            token = token
                .split(' ')
                .pop()
                .trim();
        }

        // if no token, return request object as is
        if (!token) {
            return req;
        }

        try {
            // decode and attach user data to request object
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        // return updated request object
        return req;
    }
};