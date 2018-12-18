const express = require('express'); // express
const router = express.Router(); // 라우터 모듈
const passport = require('passport') // passport 로그인 구현을 위해 사용
const logger = require('../modules/logger')

const User = require('../schema/userData')

router.get('/', (req, res) => { // 유저 데이터 가져오기
    if (req.isLogin)
        res.status(200).send(req.user).end();
    else
        res.status(404).end();
})

router.post('/login', // 로그인
    passport.authenticate('local'),
    (req, res) => {
        res.status(200).send(req.user).end();
    });

router.post('/logout', function (req, res, next) { // 로그아웃
    if (req.isLogin) {
        logger.log(`[LogOut] ${req.user.email}`)
        req.logout();
    }
    res.status(200).end();
});

router.post('/register', function (req, res, next) {
    var email = req.body.email; // 유저 이메일
    var pw = req.body.password; // 유저 패스워드

    var phoneNumber = req.body.phoneNumber
    var school = req.body.school
    var age = (parseInt(req.body.age) != NaN ? req.body.age : 0)

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
                }).end()
            }
            if (data) {
                logger.log(`[Register] 이미 있는 사용자`)
                res.status(400).send({
                    message: "이미 있는 사용자 입니다.",
                    succ: false
                }).end()
            }
            else {
                var newUser = new User({
                    email: email,
                    password: pw,
                    phoneNumber: phoneNumber,
                    school: school,
                    age: age,
                    isAcceptance: isAcceptance
                });
                newUser.save(err => {
                    if (err) {
                        logger.log(`[Register] ${err}`)
                        res.status(500).send({
                            message: "서버 장애가 발생하였습니다.",
                            succ: false
                        }).end()
                    }
                    logger.log(`[Register] 유저 생성 : ${email}`)
                    res.status(200).send({
                        message: "회원가입에 성공하였습니다.",
                        succ: true
                    }).end()
                })
            }
        })
    }
}); // 회원 가입

router.post('/update', function (req, res, next) { // 계정 정보 변경
    if (req.isLogin)
    {
        var data = {
            phoneNumber: req.body.phoneNumber,
            school: req.body.school,
            age: req.body.age,
            isAcceptance : req.body.isAcceptance
        }
        var pw = {
            cPassword : req.body.cPassword,
            nPassword : req.body.nPassword
        }
        User.findOneAndUpdate({email:req.user.email},data,(err,data)=>{
            if (err) {
                logger.log(`[Update] ${err}`)
                res.status(500).send({
                    message: "서버 장애가 발생하였습니다.",
                    succ: false
                }).end()
            }
            if(pw.cPassword && pw.nPassword){
                if(data.password == pw.cPassword){
                        User.updateOne({ email: data.email }, { password: pw.nPassword},(err)=>{
                            delete data.password
                            res.send(data).end()
                    })
                }
                else{
                    res.status(500).send({
                        message: "현재 비밀번호가 틀립니다.",
                        succ: false
                    }).end()
                }
            }
            else{
                //delete data.password
                res.send(data).end()
            }
        })
    }
    else
    {
        res.status(404).send({
            message: "로그인이 필요한 서비스입니다.",
            succ: false
        }).end()
    }
});

module.exports = router; // 내보내기 -> app.js