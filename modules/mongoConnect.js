// Mongo DB
const mongoose = require('mongoose');
const _db = mongoose.connection;
_db.on('error', console.error);
_db.once('open', function () {
    console.log("MongoDB 연결");
});
mongoose.connect('mongodb://localhost/dicon', { useNewUrlParser: true });

module.exports = {
    getDB(){
        return _db
    }
}