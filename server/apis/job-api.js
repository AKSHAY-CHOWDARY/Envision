const express = require("express");
const jobApp = express.Router();
const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
const axios = require("axios");

require("dotenv").config();

//body parser   
jobApp.use(express.json());

let jobsTrackerObj,jobsObj;

jobApp.use((req, res, next) => {
    jobsTrackerObj = req.app.get("jobTrackingCollection");
    jobsObj = req.app.get("jobsCollection");
    next();
});

//fetch jobs data from db

jobApp.get(
    "/jobs-track/:userId",
    expressAsyncHandler(async (req, res) => {
        try {
            const { userId } = req.params;
            const Appliedjobs = await jobsTrackerObj.find({userId:userId}).toArray();
            return res.send({message:"tracking jobs",payload:Appliedjobs});
        } catch (err) {
            console.error("Error occurred:", err);
            return res.status(500).send({ message: `Jobs not found: ${err.message}` });
        }
    })
);

//add job to be tracked to db
jobApp.post(
    "/add-tracking-job",
    expressAsyncHandler(async (req, res) => {
        try {
            const { userId, jobId,status} = req.body;
            const job = await jobsObj.findOne({ job_id: jobId });
            delete job._id;
            const response = await jobsTrackerObj.insertOne({ userId:userId, ...job, status:status });
            return res.status(201).send({ message: "Job added", payload: {userId:userId, ...job, status:status } });
        } catch (err) {
            console.error("Error occurred:", err);
            return res.status(500).send({ message: `Job not added: ${err.message}` });
        }
    })
);

//change the status of job

jobApp.put(
    "/update-job-status",
    expressAsyncHandler(async (req, res) => {
        try {
            const { userId, jobId, status } = req.body;
            const response = await jobsTrackerObj.updateOne({ userId:userId, job_id: jobId }, { $set: { status: status } });
            return res.status(200).send({ message: "Job updated", payload: response });
        } catch (err) {
            console.error("Error occurred:", err);
            return res.status(500).send({ message: `Job not updated: ${err.message}` });
        }
    })
);

//delete job from tracking
jobApp.delete(
    "/delete-job",
    expressAsyncHandler(async (req, res) => {
        try {
            const { userId, jobId } = req.body;
            const response = await jobsTrackerObj.deleteOne({ userId:userId, job_id: jobId });
            return res.status(200).send({ message: "Job deleted", payload: response });
        } catch (err) {
            console.error("Error occurred:", err);
            return res.status(500).send({ message: `Job not deleted: ${err.message}` });
        }
    })
);

module.exports = jobApp;
