var User = require('../models/user');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 365; // full year, only for development TODO: change

module.exports = function(app, tokenSecret) {

    app.post('/login', function (req, res, next){
        User.findOne({email:req.body.email}, function(err, user){
            if (err){
                return next(err);
            }
            if (user == null){
                return res.status(404).json({'message': 'user not found'});
            }
            bcrypt.compare(req.body.password, user.password, function(err, isMatch) { // compares input password and database password
                if (err){
                    return next(err);
                }
                if (isMatch){
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_TIME, // use token secret to generate a token with expiration time
                    }, tokenSecret);
                    return res.status(200).json({
                        user: user,
                        token: token,
                    });
                }
                return res.status(403).send();
            });
        });
    });
    app.post('/users', function (req, res) {
        try {
            bcrypt.genSalt(saltRounds, function(err, salt) {
                if (err){
                    return res.status(500).json({'message': 'generating salt'});
                }
                bcrypt.hash(req.body.password, salt, function(err, password) { // encrypts the input password
                    if (err){
                        return res.status(500).json({'message': 'generating password'});
                    }
                    req.body.password = password; // update password with hashed password
                    var user = new User(req.body);
                    user.save(function (err, user) {
                        if (err) {
                            return res.status(500).json({'message': 'saving user'});
                        }
                        return res.status(201).json(user);
                    });
                });
            });
        } catch (error){
            return res.status(500).json({'message': 'Error creating user'});
        }
    });
};
