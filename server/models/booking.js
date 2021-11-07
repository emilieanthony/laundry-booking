var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookingSchema = new Schema({
    date : { type : Date }, // time can be stored in type Date
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    laundryroom: {
        type: String,
    }
});


module.exports = mongoose.model('booking', bookingSchema);
