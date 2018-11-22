const express = require('express'); // express
const fs = require('fs')
const router = express.Router(); // 라우터 모듈

router.get('/getContestData',(req,res)=>{
    fs.readFile('./modules/testData.json',(err,data)=>{
        res.send(JSON.parse(data))
    })
})

module.exports = router; // 내보내기 -> app.js