var Notification = require('../models/notification');
var User = require('../models/user');


module.exports = function(app) {

    app.post('/users/:id/notifications', function (req, res, next) {
        try {
            var id = req.params.id;
            User.findById(id, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user == null) {
                    return res.status(404).json({'message': 'User not found'});
                }
                var notification = new Notification(req.body);
                notification.user = user._id;
                notification.save();
                return res.status(201).json(notification);
            });
        } catch (error) {
            return res.status(500).json({'message': 'Error creating notification'});
        }
    });

    app.get('/users/:id/notifications', function (req, res, next) {
        try {
            var userId = req.params.id;
            User.findById(userId, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user == null) {
                    return res.status(404).json({'message': 'User not found'});
                }
                Notification.find({user: user._id}, function (err, notifications) {
                    if (err) {
                        return next(err);
                    }
                    return res.status(200).json({'notifications': notifications});
                });
            });
        } catch (error) {
            return res.status(500).json({'message': 'Error fetching all notifications for the user'});
        }
    });

    app.delete('/notifications/:id', function (req, res, next) {
        try {
            var id = req.params.id;
            Notification.findOneAndDelete({_id: id}, function (err, notification) {
                if (err) {
                    return next(err);
                }
                if (notification == null) {
                    return res.status(404).json({'message': 'notification not found'});
                }
                return res.json(notification);
            });
        } catch (error) {
            return res.status(500).json({'message': 'Error deleting notification'});
        }
    });
};
