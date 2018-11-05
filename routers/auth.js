var express = require('express'); // express
var router = express.Router(); // 라우터 모듈
const passport = require('passport')
var cookieParser = require('cookie-parser');

const config = require('../config') // 설정을 불러옴

router.use(express.json()); // body parser
router.use(express.urlencoded({ extended: false })); // body parser
router.use(cookieParser()); // 쿠키파서

router.get('/', (req, res) => {
    if(req.user)
        res.send("Hello " + req.user.username);
    else
        res.send("Not Login");
})

router.post('/login',
    passport.authenticate('local'),
    (req, res) => {
        res.status(200).end();
    }); // 로그인 시도
router.post('/logout', function (req, res, next) {
    req.logout();
    res.status(200).end();
}); // 로그아웃

module.exports = router; // 내보내기 -> app.js