const express = require('express'); // express
const router = express.Router(); // 라우터 모듈
const passport = require('passport') // passport 로그인 구현을 위해 사용
const cookieParser = require('cookie-parser');
const session = require('express-session'); // Session
const MongoStore = require('connect-mongo')(session); // Mongo Store

const config = require('../config') // 설정을 불러옴
const logger = require('../modules/logger')

router.use(express.json()); // body parser
router.use(express.urlencoded({ extended: false })); // body parser
router.use(cookieParser()); // 쿠키파서
router.use((req, res, next) => { // 로그인 유무 확인 미들웨어
    req.isLogin = (req.user ? true : false)
    next()
})

// Mongo DB
const mongoose = require('mongoose');
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("MongoDB 연결");
});
mongoose.connect('mongodb://localhost/dicon', { useNewUrlParser: true });
const User = require('../schema/userData');

router.get('/', (req, res) => { // 유저 데이터 가져오기
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.isLogin)
    if (req.isLogin)
        res.status(200).send(req.user);
    else
        res.status(404).end();
})

router.post('/login', // 로그인
    passport.authenticate('local'),
    (req, res) => {
        res.status(200).end();
    });

router.post('/logout', function (req, res, next) { // 로그아웃
    if(req.isLogin){
        logger.log(`[LogOut] ${req.user.email}`)
        req.logout();
    }
    res.status(200).end();
});

router.post('/register', function (req, res, next) {
    var email = req.body.email; // 유저 이메일
    var pw = req.body.password; // 유저 패스워드
    var isAcceptance = (req.body.isAcceptance ? 1 : 0) // 이메일 수신 여부

    if (!pw || !email) {
        console.log(pw, email)
        logger.log(`[Register] 데이터 없음`)
        res.status(405).end() // 데이터가 없을 시 405
    }
    else {
        User.findOne({ email: email }, function (err, data) {
            if (err) {
                logger.log(`[Register] ${err}`)
                res.status(500).send({
                    message: "서버 장애가 발생하였습니다.",
                    succ: false
                })
            }
            if (data) {
                logger.log(`[Register] 이미 있는 사용자`)
                res.status(400).send({
                    message: "이미 있는 사용자 입니다.",
                    succ: false
                })
            }
            else {
                var newUser = new User();
                newUser.email = email
                newUser.password = pw
                newUser.isAcceptance = isAcceptance

                newUser.save(err => {
                    if (err) {
                        logger.log(`[Register] ${err}`)
                        res.status(500).send({
                            message: "서버 장애가 발생하였습니다.",
                            succ: false
                        })
                    }
                    logger.log(`[Register] 유저 생성 : ${email}`)
                    res.status(200).send({
                        message: "회원가입에 성공하였습니다.",
                        succ: true
                    })
                })
            }
        })
    }
}); // 회원 가입

module.exports = router; // 내보내기 -> app.js