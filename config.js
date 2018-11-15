const config = {
    mongo: {
        url: 'mongodb://localhost/dicon',
        autoRemove: 'interval',
        autoRemoveInterval: 60 // In minutes. Default
    },
    secretKey: "TMP" // 세션 보안 키 설정
}
module.exports = config
//CREATE DATABASE dicon
// CREATE TABLE userData
//     (
//     `pid`           INT            NOT NULL    AUTO_INCREMENT,
//     `username`      VARCHAR(45)    NULL,
//     `email`         VARCHAR(45)    NOT NULL,
//     `password`      VARCHAR(45)    NOT NULL,
//     `isAcceptance`  boolean        NOT NULL,
//     PRIMARY KEY(pid)
//     );
