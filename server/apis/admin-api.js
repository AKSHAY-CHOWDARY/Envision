const exp = require("express");
const adminApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
const axios = require("axios");

const jobs_key = process.env.LINKEDIN_JOBS_API_KEY;

require("dotenv").config();

//body parser
adminApp.use(exp.json());

let jobsObj;

adminApp.use((req, res, next) => {
    jobsObj = req.app.get("jobsCollection");
    next();
});

//fetch jobs data by scraping and save to DB
adminApp.post(
    "/jobs-scrape",
    expressAsyncHandler(async (req, res) => {

        const { field, page } = req.body;

        try {
            // Fetch jobs data from the scraping API
            const apiResponse = await axios.get(
                `http://api.scrapingdog.com/linkedinjobs?api_key=${jobs_key}&field=${field}&geoid=India&page=${page}`
            );

            // The actual data returned by the API
            const jobsData = apiResponse.data
            //console.log(jobsData);
             // Add current date to each job
             const jobsWithDate = jobsData.map(job => ({
                ...job,
                date: new Date()
            }));

            // Save jobs data to the database
            const response = await jobsObj.insertMany(jobsWithDate);

            // Return success response
            return res.status(201).send({ message: "Jobs created", payload: response });
        } catch (err) {
            console.error("Error occurred:", err);

            // Return error response with detailed message
            return res.status(500).send({ message: `Jobs not created: ${err.message}` });
        }
    })
);

// delete expired (2+ weeks ) jobs
adminApp.delete('/old-jobs-delete', expressAsyncHandler(async (req, res) => {
    try {
        const response = await jobsObj.deleteMany({ date: { $lt: new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000) } });
        return res.send({ message: "Expired jobs deleted", payload: response });
    } catch (err) {
        console.error("Error occurred:", err);
        return res.send({ message: `Jobs not deleted: ${err.message}` });
    }
}));


module.exports = adminApp;

