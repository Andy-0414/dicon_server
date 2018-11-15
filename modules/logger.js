module.exports = {
    log(...data){
        var now = new Date().toLocaleString()
        data.forEach(x => {
            console.log(`[#DATE :${now}] ${x}`);
        });
    },
}