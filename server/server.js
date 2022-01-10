const express = require('express');
const axios = require('axios');
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;
const Log = require("./helper/Log")
const twitterJobs = require("./CronJobs/Twitter")
const discordJobs = require("./CronJobs/Discord")
const jobs = Object.assign(twitterJobs, discordJobs)


const app =  express();
app.use(express.json());

app.use(function (req, res, next) {
    Log.request(req.path)
    next()
})

app.get('/cron/stop',async (req, res, next) => {
    let job_str = req.body.job,
        job = jobs[job_str]
    try{
        job.stop()
        let msg = `Stopped cron job ${job_str} `
        Log.log(msg, "INFO", "Yellow")
        res.json({status:"success", msg:msg})
    }catch(e){
        Log.error(e.toString())
        res.json({status:"success", msg:e.toString()})
    }
});

app.get('/cron/start',async (req, res, next) => {
    let job_str = req.body.job,
        job = jobs[job_str]
    try{
        job.start()
        let scheduled = job.nextDate(),
            msg = `Started cron job ${job_str}`
        Log.log(msg, "INFO", "Green")
        res.json({status:"success", msg:msg, scheduled: scheduled})
    }catch(e){
        Log.error(e.toString())
        res.json({status:"success", msg:e.toString()})
    }
});


app.get('/cron/edit',async (req, res, next) => {
    let job_str = req.body.job,
        new_schedule = req.body.schedule,
        job = jobs[job_str]
    try{
        job.stop()
        job.setTime(new CronTime(new_schedule))
        job.start()
        let msg = `Set '${new_schedule}' as new schedule for cron job ${job_str} `
        Log.log(msg, "INFO", "Yellow")
        res.json({status:"success", msg:msg})
    }catch(e){
        Log.error(e.toString())
        res.json({status:"success", msg:e.toString()})
    }
});


app.get('/cron/edit_multiply',async (req, res, next) => {
    let jobs2 = req.body.jobs, stats = []
    try{
        jobs2.forEach( job_obj => {
            let job = jobs[job_obj.name]
            if(!job){throw `No job ${job_obj.name}`}
            job.stop()
            job.setTime(new CronTime(job_obj.schedule))
            job.start()
            let msg = `Set '${job_obj.schedule}' as new schedule for cron job ${job_obj.name} `
            stats.push({status:200,job:job_obj.name})
            Log.log(msg, "INFO", "Yellow")
        })
    }catch(e){
        Log.error(e.toString())
        stats.push({status:500,msg:e.toString()})
    }
    res.json(stats)
});


app.get('/cron/list',async (req, res, next) => {
    try{
        let msg = `Listed all ${Object.keys(jobs).length} jobs`
        Log.log(msg, "", "Cyan")
        res.json({status:"success", msg:msg, data:getCronStatus()})
    }catch(e){
        Log.error(e.toString())
        res.json({status:"success", msg:e.toString()})
    }
});


const port = 8097;
app.listen(port, () =>{
    console.log(`ms_cron is running at http://localhost:${port}`)
})

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
