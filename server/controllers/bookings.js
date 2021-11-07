var Booking = require ('../models/booking');
var User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (app) {

    // List all bookings
    app.get('/bookings', function (req, res, next) {
        try {
            Booking.find(function (err, bookings) {
                if (err) {
                    return next(err);
                }
                return res.json({'bookings': bookings});
            });
        } catch (error) {
            return res.status(500).json({'message': 'Error fetching all bookings'});
        }
    });
   

    //delete specific id
    app.delete('/bookings/:id', function (req, res, next) {
        try {
            var id = req.params.id;
            Booking.findOneAndDelete({_id: id}, function (err, booking) {
                if (err) {
                    return next(err);
                }
                if (booking == null) {
                    return res.status(404).json({'message': 'booking not found'});
                }
                return res.json(booking);
            });
        } catch (error) {
            return res.status(500).json({'message': 'Error deleting booking'});
        }
    });

    // Creating a booking for a user - relationship
    app.post ('/users/:id/bookings', function (req, res, next) {
        try {
            var id = req.params.id;
            User.findById(id, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user == null) {
                    return res.status(404).json({'message': 'User not found'});
                }
                if (new Date(req.body.date).toString() === 'Invalid Date' || !req.body.laundryroom){
                    return res.status(400).json({'message': 'Invalid argument'});
                }
                var booking = new Booking(req.body);
                booking.user = user._id;
                booking.save();
                return res.status(201).json(booking);
            });
        } catch (error){
            return res.status(500).json({'message': 'Error creating booking'});
        }
    });

    // Get all bookings for a user - relationsship + sorting
    app.get('/users/:id/bookings', function(req, res, next){
        try {
            var userId = req.params.id;
            User.findById(userId, function (err, user){
                if (err){return next(err); }
                if (user == null){
                    return res.status(404).json({'message': 'User not found'});
                }
                Booking.find({user: user._id}, function(err, bookings) {
                    if (err){return next(err); }
                    var sort = req.query.sort;
                    if(!sort){
                        return res.status(200).json({'bookings': bookings});
                    } else {
                        if(sort=== 'asc') {
                            bookings.sort((a,b )=> a.date-b.date);
                            res.json({'bookings': bookings});
                        } else if (sort === 'desc'){
                            bookings.sort((a,b)=> b.date-a.date);
                            res.json({'bookings': bookings});
                        } else {
                            res.status(400).send('Provided invalid sorting parameter');
                        }
                    }
                });
            }); 
        } catch (error){
            return res.status(500).json({'message': 'Error fetching all bookings for the user'});
        }
    });

    // Get a booking by id for a user - relationship
    app.get('/users/:id/bookings/:booking_id', function(req, res, next){
        try {
            var userId = req.params.id;
            var bookingId = req.params.booking_id;
            if(!ObjectId.isValid(userId)) {
                return res.status(400).json({ 'message': 'Invalid user id'});
            }
            if(!ObjectId.isValid(bookingId)) {
                return res.status(400).json({ 'message': 'Invalid booking id'});
            }
            User.findById(userId, function (err, user){
                if (err){return next(err); }
                if (user == null){
                    return res.status(404).json({'message': 'User not found'});
                }
                Booking.findOne({_id: bookingId}, function(err, booking) {
                    if (err){return next(err); }
                    if (booking == null){
                        return res.status(404).json({'message': 'Booking not found'});
                    }
                    return res.status(200).json(booking);
                });
            });
        } catch (error){
            return res.status(500).json({'message': 'Error fetching the booking'});
        }
    });

    // Delete a specific booking for a user - relationship
    app.delete('/users/:id/bookings/:booking_id', function(req, res, next){
        try{
            var userId = req.params.id;
            var bookingId = req.params.booking_id;
            if(!ObjectId.isValid(userId)) {
                return res.status(400).json({ 'message': 'Invalid user id'});
            }
            if(!ObjectId.isValid(bookingId)) {
                return res.status(400).json({ 'message': 'Invalid booking id'});
            }
            User.findById(userId, function (err, user){
                if (err){return next(err); }
                if (user == null){
                    return res.status(404).json({'message': 'User not found'});
                }
                Booking.findOneAndDelete({_id: bookingId}, function(err, booking) {
                    if (err){return next(err); }
                    if (booking == null){
                        return res.status(404).json({'message': 'Booking not found'});
                    }
                    return res.status(200).json(booking);
                });
            });
        } catch (error){
            return res.status(500).json({'message': 'Error deleting the booking'});
        }
    });
};
