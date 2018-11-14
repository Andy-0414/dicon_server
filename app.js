const express = require('express'); // express
const app = express(); // express
const passport = require('passport') // passport 로그인 구현을 위해 사용
    , LocalStrategy = require('passport-local').Strategy; // Passport Local
const session = require('express-session'); // Session
const MySQLStore = require('express-mysql-session')(session); // MySQL Store
const cookieParser = require('cookie-parser')
var path = require('path');

const config = require('./config') // 설정을 불러옴

var mysql = require('mysql2'); // MYSQL 사용을 위한 모듀
var con = mysql.createConnection(config.mysql); // MYSQL 접속
con.connect(err => { // SQL 접속
    if (err) {
        console.error('error connecting: ' + err.stack); // 연결 실패
        return;
    }
    console.log('connected as id ' + con.threadId); // 연결 성공
});

app.use(session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(config.mysql)
})) // 세션 스토리지

app.use(passport.initialize()); // 패스포트 사용
app.use(passport.session()); // 패스포트 세션 사용

app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: false })); // body parser
app.use(cookieParser()); // 쿠키파서
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일

passport.use(new LocalStrategy(
    (username, password, done) => {
        var sql = "SELECT email,password FROM userData WHERE email=?"
        con.query(sql, username, (err, result, fields) => {
            if (!result[0]) {
                console.log("[FAIL LOGIN] ID");
                done(null, false)
            }
            else {
                if (result[0].password == password) {
                    console.log(`[LOGIN USER]\nID : ${username}`);
                    done(null, result[0]);
                }
                else {
                    console.log("[FAIL LOGIN] PW");
                    done(null, false)
                }
            }
        })
    }
)); // 로그인 조건 - local

passport.serializeUser((user, done) => { // 세션 생성
    done(null, user); // 구현해라
});

passport.deserializeUser((user, done) => { // 세션 확인
    done(null, user);// 구현해라
});

app.listen(3030, () => { })

app.use((req, res, next) => {
    req.isLogin = (req.user ? true : false)
    next()
})

var authRouter = require('./routers/auth'); // 라우터 로딩

app.use('/auth', authRouter); // 라우터 연결

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})