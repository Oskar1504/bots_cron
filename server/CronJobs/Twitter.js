const CronJob = require('cron').CronJob;
const Log = require("../helper/Log")
const axios = require("axios");

let jobs = {
    job_1: new CronJob(
        '0/30 * * * * *',
        function () {
            cron_loop()
            getCronStatus()
        },
        null,
        true
    ),
    tweetDailyRecipe: new CronJob(
        //'0 0 8 1/1 * *',
        '0 0/1 * 1/1 * *',
        function () {
            let url = `http://localhost:42042/tweetDailyRecipe`
            Log.info(`Axios req to ${url}`)
            axios({
                method: 'get',
                url
            })
                .then(function (response) {
                    Log.success("Axios req to " + url + " successful. Data: " + JSON.stringify(response.data))
                })
                .catch(function (e) {
                    Log.error("Axios req to " + url + " failed")
                    Log.error(e.toString())
                })
        },
        null,
        true
    )
}

function getCronStatus(){
    let o = []
    Object.keys(jobs).forEach( key => {
        let job = jobs[key],
            running = (job.running === undefined) ? false : job.running

        o.push({
            name:key,
            running:running,
            scheduled:job.nextDate()
        })
    })

    return o
}


function cron_loop(){
    Log.info("Cron loop. Delay atm 10second")
}


module.exports = jobs

