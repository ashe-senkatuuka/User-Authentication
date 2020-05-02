const express = require('express');
const path = require('path');
const User = require('../models/userModel');

const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

//Initialize packages
const router = express.Router();
const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'thisisthesecretkey';

router.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, '../views', 'userAuthentication.html'));
    res.sendFile(path.join(__dirname, '../views', 'userRegistration.html'));

})

// register a user
router.post('/users/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const newUser = new User({
        name,
        email,
        password,
    });
    User.createUser(newUser, (error, user) => {
        if (error) { console.log(error); }
        // res.send({ user });
        res.redirect('/users/login')
    });
});

// User Login
router.get('/users/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'userAuthentication.html'));
});

router.post('/users/login', (req, res) => {
    if (req.body.email && req.body.password) {
        const email = req.body.email;
        const password = req.body.password;
        User.getUserByEmail(email, (err, user) => {
            if (!user) {
                // res.status(404).json({ message: 'The user does not exist!' });
                res.render('userAuthentication',{message: 'The user does not exist!' })
            } else {
                User.comparePassword(password, user.password, (error, isMatch) => {
                    if (error) throw error;
                    if (isMatch) {
                        const payload = { id: user.id };
                        const token = jwt.sign(payload, jwtOptions.secretOrKey);
                        // res.json({ message: 'ok', token });
                        res.render('userAuthenticationSuccess',{ message:'Welcome to the new world' });
                    } else {
                        res.render('userAuthentication',{ message: 'The password is incorrect!' })
                        // res.status(401).json({message: 'The password is incorrect!'}); 
                    }
                });
            }
        });
    }
});
    


//Make controller available to the entire project
module.exports = router;