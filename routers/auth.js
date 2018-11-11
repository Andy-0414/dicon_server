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
router.post('/register', function (req, res, next) {
    var id = req.body.username; // 유저 아이디
    var pw = req.body.password; // 유저 패스워드
    var email = req.body.email; // 유저 이메일
    if (!id || !pw || !email) {
        console.log(id, pw, email)
        console.log("[NOT DATA]")
        res.status(405).end() // 데이터가 없을 시 405
    }
    else {
        console.log(id, pw, email)
        var sql = "SELECT id FROM userData WHERE id=?";
        con.query(sql, [id], (err, result, fields) => {
            if (err) {
                res.status(505).end(); // 에러 시 505
            }
            if (result.length == 0) {
                var sql = "INSERT INTO userData (id, password, email) VALUES(?,?,?)";
                con.query(sql, [id, pw, email], (err, result, fields) => {
                    if (err) {
                        res.status(505).end(); // 에러 시 505
                    }
                    else {
                        console.log(`[Create User]\nID : ${id}`);
                        res.status(200).end() // 제대로 생성됬을 시 200
                    }
                })
            }
            else {
                console.log("[SAME USER]")
                res.status(405).end(); // 이미 있는 사용자일시 405
            }
        });
    }
}); // 회원 가입

router.post('/token', function (req, res, next) {
    if (req.user) {
        res.send({
            username: req.user.username
        });
    }
    else {
        res.status(404);
    }
}); // 로그인 확인

module.exports = router; // 내보내기 -> app.js