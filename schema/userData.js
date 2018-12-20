var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('userData', new Schema({
    email: String,
    password: String,
    phoneNumber: String,
    school: String,
    age: Number,
    isAcceptance: Boolean,
    isAdmin: Boolean,
    ownerContest: Array,
    participantContest: Array,
    winContest: Array
}));