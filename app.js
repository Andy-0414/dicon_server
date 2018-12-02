const express = require('express'); // express
const app = express(); // express
const passport = require('passport') // passport 로그인 구현을 위해 사용
    , LocalStrategy = require('passport-local').Strategy; // Passport Local
const session = require('express-session'); // Session
const MongoStore = require('connect-mongo')(session); // Mongo Store
const cookieParser = require('cookie-parser')
const history = require('connect-history-api-fallback');

const config = require('./config') // 설정을 불러옴
const logger = require('./modules/logger')

const db = require('./modules/mongoConnect').getDB

app.use(session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore(config.mongo)
})) // 세션 스토리지

app.use(passport.initialize()); // 패스포트 사용
app.use(passport.session()); // 패스포트 세션 사용

app.use(history());
app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: false })); // body parser
app.use(cookieParser()); // 쿠키파서
app.use(express.static('public'));
app.use(express.static('img')); // 정적 파일

const User = require('./schema/userData');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true 
},
    (req, username, password, done) => {
        User.findOne({ email: username }, (err, data) => {
            if (err) {
                logger.log(`[Login] ${err}`)
                return done(err)
            }
            if (!data) {
                logger.log(`[Login] 이메일이 일치하지 않음 : ${username}`)
                return done(null, false, { message: '이메일이 일치하지 않습니다.', succ: false });
            }
            if (data.password != password) {
                logger.log(`[Login] 비밀번호가 일치하지 않음 : ${username}`)
                return done(null, false, { message: '비밀번호가 일치하지 않습니다.', succ: false });
            }
            logger.log(`[Login] 로그인 성공 : ${username}`)
            delete data[password]
            return done(null, data);
        });
    }
)); // 로그인 조건 - local


passport.serializeUser((user, done) => { // 세션 생성
    User.findOne({ email: user.email }, (err, data) => {
        done(null, data);
    })
});

passport.deserializeUser((user, done) => { // 세션 확인
    User.findOne({ email: user.email }, (err, data) => {
        done(null, data);
    })
});

app.listen(3030, () => { })

app.use((req, res, next) => { // 로그인 유무 확인 미들웨어
    req.isLogin = (req.user ? true : false)
    next()
})

const authRouter = require('./routers/auth'); // 라우터 로딩
const contestRouter = require('./routers/contest'); // 라우터 로딩
const joinRouter = require('./routers/join'); // 라우터 로딩

app.use('/auth', authRouter); // 라우터 연결
app.use('/contest', contestRouter); // 라우터 연결
app.use('/join', joinRouter); // 라우터 연결

app.use(function (err, req, res, next) { // 에러 핸들링
    logger.log(err.stack);
    res.status(500).send('SERVER ERROR');
});
