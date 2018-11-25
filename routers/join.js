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
                    answer: req.body.data
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