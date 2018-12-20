const express = require('express'); // express
const router = express.Router(); // 라우터 모듈
const path = require('path');

const config = require('../config') // 설정을 불러옴
const logger = require('../modules/logger')

const Contest = require('../schema/contestData')
const User = require('../schema/userData')
const Join = require('../schema/joinData')

router.post('/joinContest', (req, res) => { // [C]reate
    if (req.isLogin) {
        var id = req.body.id
        Join.findOne({ id: id }, (err, data) => {
            if(data.data.findIndex(x => x.email == req.user.email) == -1)
            {
                data.data.push({
                    email: req.user.email,
                    phoneNumber: req.user.phoneNumber,
                    school: req.user.school,
                    age: req.user.age,
                    answer: req.body.data,
                })
            }
            data.save(err => {
                User.findOne({ email: req.user.email }, (err, data) => {
                    if(data.participantContest.indexOf(id) == -1)
                    {
                        data.participantContest.push(id)
                    }
                    data.save(err => {
                        res.send({
                            message: "성공",
                            succ: true
                        })
                    })
                })
            })
        })
    }
    else {
        res.status(400).send({
            message: "로그인 필요",
            succ: false
        })
    }
})
router.post('/okUser', (req, res) => { // [C]reate
    if (req.isLogin) {
        var id = req.body.id
        var email = req.body.email
        Join.findOne({ id: id }, (err, data) => {
            var idx = data.data.findIndex(x => x.email == email)
            if (idx != -1) {
                var i = data.okUser.indexOf(email)
                if( i == -1 )
                    data.okUser.push(email)
                else
                    data.okUser.splice(i,1);
                data.save(err => {
                    res.send({
                        message: "성공",
                        succ: true
                    })
                })
            }
            else{
                res.status(404).send({
                    message: "없는 유저입니다.",
                    succ: false
                })
            }
        })
    }
    else {
        res.status(400).send({
            message: "로그인 필요",
            succ: false
        })
    }
})

router.post('/getJoinData', (req, res) => { //[R]ead
    if (req.isLogin) {
        var id = req.body.id
        User.findOne({ email: req.user.email }, (err, userdata) => {
            if (userdata.ownerContest.indexOf(id) != -1) {
                Join.findOne({ id: id }, (err, data) => {
                    if (err || !data) {
                        logger.log(`[UpdateContest] ${err}`)
                        res.status(500).send({
                            message: "서버 장애가 발생하였습니다.",
                            succ: false
                        })
                    }
                    data.data.map(x=>{
                        x.ok = (data.okUser.indexOf(x.email) != -1)
                        return x
                    })
                    res.send(data.data)
                })
            }
            else {
                res.status(400).send({
                    message: "권한 없음",
                    succ: false
                })
            }
        })
    }
    else {
        res.status(400).send({
            message: "로그인 필요",
            succ: false
        })
    }
})

router.post('/detachContest', (req, res) => { // [D]elete
    if (req.isLogin) {
        var id = req.body.id
        Join.findOne({ id: id }, (err, data) => {
            var index = data.data.findIndex(x => x.email == req.user.email)
            if (index != -1) {
                data.data.splice(index, 1)
                data.save(err => {
                    User.findOne({ email: req.user.email }, (err, data) => {
                        var idx = data.participantContest.indexOf(id)
                        if (idx != -1) {
                            data.participantContest.splice(idx, 1)
                            data.save(err => {
                                res.send({
                                    message: "성공",
                                    succ: true
                                })
                            })
                        }
                    })
                })
            }
            else {
                res.status(400).send({
                    message: "권한 없음",
                    succ: false
                })
            }
        })
    }
    else {
        res.status(400).send({
            message: "로그인 필요",
            succ: false
        })
    }
})

module.exports = router; // 내보내기 -> app.js