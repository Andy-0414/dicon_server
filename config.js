const config = {
    mysql: { // MYSQL 연결 설정
        host: 'localhost',
        user: 'root',
        port: 3306,
        password: '1111',
        database: 'dsmad'
    },
    secretKey: "TMP" // 세션 보안 키 설정
}
module.exports = config