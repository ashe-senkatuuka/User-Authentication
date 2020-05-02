//Require packages
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

//Get reference to mongoose Schema function
//Models are defined through the schema interface
const Schema = mongoose.Schema;

//Create UserSchema and define the needed properties
const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
});

//Compile schema into a model
/* A model is a class with which we construct documents.
In this case, each document will be a user with properties
and behaviors as declared in our schema. */
const User = mongoose.model('User', UserSchema);

//Make the User model available to the project
module.exports = User;

//Custom method to save users to the database with encrypted passwords
module.exports.createUser = (newUser, callback) => {                //Receive user object as an argument
    bcryptjs.genSalt(10, (err, salt) => {                           //Convert password into encrypted string
        bcryptjs.hash(newUser.password, salt, (error, hash) => {    //Convert user password into bcrypted password
            // store the hashed password
            const newUserResource = newUser;
            newUserResource.password = hash;
            newUserResource.save(callback);
        });
    });
};

//Method to return user with given email
module.exports.getUserByEmail = (email, callback) => {
    const query = { email };
    User.findOne(query, callback);
};

//Method to compare saved password to user provided password.
module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

