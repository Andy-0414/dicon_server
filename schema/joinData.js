var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('userData', new Schema({
    id : Number,
    data : Array
}));