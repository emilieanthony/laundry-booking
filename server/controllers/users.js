var User = require('../models/user');

module.exports = function(app) {

    // Get all users
    app.get('/users', function (req, res, next) {
        try {
            User.find(function (err, users) {
                if (err) {
                    return next(err);
                }
                return res.json({'users': users});
            });
        } catch (error) {
            return res.status(500).json({'message': 'Error fetching users'});
        }
    });

    // Get specific user by id
    app.get('/users/:id', function (req, res, next) {
        try {
            var id = req.params.id;
            User.findById(id, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user == null) {
                    return res.status(404).json({'message': 'User not found'});
                }
                return res.json(user);
            });
        } catch (error){
            return res.status(500).json({'message': 'Error fetching user'});
        }
    });

    // Delete a user by id
    app.delete('/users/:id', function (req, res, next) {
        try {
            var id = req.params.id;
            User.findOneAndDelete({_id: id}, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user == null) {
                    return res.status(404).json({'message': 'User not found'});
                }
                return res.json(user);
            });
        } catch (error){
            return res.status(500).json({'message': 'Error deleting user'});
        }
    });

    // Delete all users
    app.delete('/users', function (req, res, next) {
        try {
            User.remove({}, function (err, user) {
                if (err) {
                    return next(err);
                }
                return res.json(user);
            });
        } catch (error){
            return res.status(500).json({'message': 'Error deleting users'});
        }
    });

    // Update user with a given id
    app.put('/users/:id', function (req, res, next) {
        try{
            var id = req.params.id;
            User.findOneAndReplace(id, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user == null) {
                    return res.status(404).json({'message': 'User not found'});
                }
                user.name = req.body.name;
                user.email = req.body.email;
                user.password = req.body.password;
                user.save();
                return res.json(user);
            });
        } catch (error){
            return res.status(500).json({'message': 'Error updating user'});
        }
    });

    // Partially update user with the given id
    app.patch('/users/:id', function (req, res, next) {
        try {
            var id = req.params.id;
            User.findById(id, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user == null) {
                    return res.status(404).json({'message': 'User not found'});
                }
                user.name = (req.body.name || user.name);
                user.email = (req.body.email || user.email);
                user.password = (req.body.password || user.password);
                user.save();
                return res.json(user);
            });
        } catch (error){
            return res.status(500).json({'message': 'Error updating user'});
        }
    });
};


