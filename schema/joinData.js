var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('joinData', new Schema({
    id : Number,
    data : Array
}));