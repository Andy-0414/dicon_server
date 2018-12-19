const config = {
    mongo: {
        url: 'mongodb+srv://andy:8CcdLiVD9PlMAdfj@thisismongodb-lk0as.mongodb.net/dicon?retryWrites=true',
        autoRemove: 'interval',
        autoRemoveInterval: 60 // In minutes. Default
    },
    secretKey: "TMP", // 세션 보안 키 설정
    tags: [
        {
            "color": "green",
            "text": "교내대회"
        },
        {
            "color": "green",
            "text": "외부대회"
        },
        {
            "color": "red",
            "text": "초등"
        },
        {
            "color": "red",
            "text": "중등"
        },
        {
            "color": "red",
            "text": "고등"
        },
        {
            "color": "red",
            "text": "대학"
        },
        {
            "color": "orange",
            "text": "해커톤"
        },
    ]// 기본 태그
}
module.exports = config