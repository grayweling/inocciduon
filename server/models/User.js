// import outside stuff
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// create schema stuff
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 5
        }
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

// set up presave middleware to create password
userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

// compare incoming password w hashed password
userSchema.methods.isCorrectPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// turn into a model called User
const User = model('User', userSchema);

// export User
module.exports = User;