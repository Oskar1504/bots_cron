const CronJob = require('cron').CronJob;
const Log = require("../helper/Log")
const axios = require("axios");

let jobs = {
    job_displayer_twitter: new CronJob(
        '0 0/1 * 1/1 * *',
        // "0 0 9 1/1 * *",
        function () {
            getCronStatus().forEach(job => {
                Log.info(`${job.name} | ${job.running} | ${job.scheduled}`)
            })

        },
        null,
        false
    ),
    tweetDailyRecipeLowCarb: new CronJob(
        '0 0 8 1/1 * *',
        // '0 0/5 * 1/1 * *',
        function () {
            let url = `http://localhost:42042/tweetDailyRecipe`
            Log.request(`Axios req to ${url}`)
            axios({
                method: 'get',
                url,
                params:{
                    categorie:"low-carb"
                }
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
    ),
    tweetDailyRecipeAlltag: new CronJob(
        '0 0 10 1/1 * *',
        function () {
            let url = `http://localhost:42042/tweetDailyRecipe`
            Log.request(`Axios req to ${url}`)
            axios({
                method: 'get',
                url,
                params:{
                    categorie:"schnelle-alltagskueche"
                }
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
    ),
    tweetDailyRecipeGesunde: new CronJob(
        '0 0 9 1/1 * *',
        function () {
            let url = `http://localhost:42042/tweetDailyRecipe`
            Log.request(`Axios req to ${url}`)
            axios({
                method: 'get',
                url,
                params:{
                    categorie:"gesunde-ernaehrung"
                }
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
    ),
    tweetDailyRecipeVegetarisch: new CronJob(
        '0 0 11 1/1 * *',
        function () {
            let url = `http://localhost:42042/tweetDailyRecipe`
            Log.request(`Axios req to ${url}`)
            axios({
                method: 'get',
                url,
                params:{
                    categorie:"vegetarische-vielfalt"
                }
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



module.exports = jobs

