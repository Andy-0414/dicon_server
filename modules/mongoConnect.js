// Mongo DB
const mongoose = require("mongoose");
const _db = mongoose.connection;
const autoIncrement = require("mongoose-auto-increment");

const config = require("../config"); // 설정을 불러옴
const logger = require("../modules/logger");

_db.on("error", console.error);
_db.once("open", function () {
	logger.log("MongoDB 연결");
});
mongoose.connect(process.env.MONGODB_URI || config.mongo.url, { useNewUrlParser: true });
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

autoIncrement.initialize(_db);

module.exports = {
	getDB() {
		return _db;
	},
};
