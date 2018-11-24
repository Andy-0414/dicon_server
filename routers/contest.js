const express = require('express'); // express
const fs = require('fs')
const multer = require('multer');
const router = express.Router(); // 라우터 모듈
const path = require('path');

const config = require('../config') // 설정을 불러옴
const logger = require('../modules/logger')

const Contest = require('../schema/contestData')
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'img/');
        },
        filename: function (req, file, cb) {
            Contest.findOneAndUpdate({ id: req.body.id }, { img: req.body.id + path.extname(file.originalname)}, (err, data) => {
                if (err || !data) {
                    logger.log(`[UpdateContest] ${err}`)
                    res.status(500).send({
                        message: "서버 장애가 발생하였습니다.",
                        succ: false
                    })
                }
                cb(null, req.body.id + path.extname(file.originalname));
            })
        }
    }),
});

router.post('/createContest', (req, res) => { // [C]reate
    var newContest = new Contest(req.body.data)
    newContest.nextCount((err, count) => {
        if (req.body.data.img)
            newContest.img = count + path.extname(req.body.data.img)
        else
            newContest.img = 'noneImage.png'
        newContest.save(err => {
            if (err) {
                logger.log(`[CreateContest] ${err}`)
                res.status(500).send({
                    message: "서버 장애가 발생하였습니다.",
                    succ: false
                })
            }
            else {
                res.send({ id: count })
            }
        })
    })


})

router.get('/getContestData', (req, res) => { // [R]ead
    Contest.find((err, data) => {
        if (err || !data) {
            logger.log(`[GetContestData] ${err}`)
            res.status(500).send({
                message: "서버 장애가 발생하였습니다.",
                succ: false
            })
        }
        if (req.isLogin) {
            res.send(data.map(x => {
                x.isJoin = (req.user.participantContest.indexOf(x.id) != -1)
                return x
            }))
        }
        else {
            res.send(data.map(x => {
                x.isJoin = false
                return x
            }))
        }
    })
    // fs.readFile('./modules/testData.json', (err, data) => {
    //     res.send(JSON.parse(data))
    // })
})

router.post('/updateContest', (req, res) => { // [U]pdate
    Contest.findOneAndUpdate({ id: req.body.data.id }, req.body.data, (err, data) => {
        if (err || !data) {
            logger.log(`[UpdateContest] ${err}`)
            res.status(500).send({
                message: "서버 장애가 발생하였습니다.",
                succ: false
            })
        }
        res.send(data)
    })
})

router.post('/deleteContest', (req, res) => { // [D]elete
    Contest.deleteOne({ id: req.body.data.id }, (err) => {
        if (err) {
            logger.log(`[DeleteContest] ${err}`)
            res.status(500).send({
                message: "서버 장애가 발생하였습니다.",
                succ: false
            })
        }
        res.send({
            message: "서버 장애가 발생하였습니다.",
            succ: true
        })
    })
})

router.post('/imgUpload', upload.single('img'), (req, res) => {
    res.send("OK")
})

module.exports = router; // 내보내기 -> app.js