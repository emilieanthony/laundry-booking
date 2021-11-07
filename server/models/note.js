var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
    headline: {type: String},
    content: {type: String},
    writer: {type: String},
});

module.exports = mongoose.model ('note', noteSchema);