const CronJob = require('cron').CronJob;
const Log = require("../helper/Log")
const axios = require("axios");

let jobs = {
    job_discord: new CronJob(
        '0/30 * * * * *',
        function () {
            cron_loop()
            getCronStatus()
        },
        null,
        false
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
    Log.info("Discord cronjob nur zum test")
}


module.exports = jobs

