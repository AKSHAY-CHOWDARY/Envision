require("dotenv").config(); 
const express = require("express");
const path = require("path");
const mongoClient = require("mongodb").MongoClient;
const cors = require("cors");

const app=express();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

// Connect to MongoDB
mongoClient
    .connect(MONGO_URI)
    .then((client) => {
        const dbObj = client.db(DB_NAME);
        const usersCollection = dbObj.collection("usersCollection");  
        const jobsCollection = dbObj.collection("jobsCollection");     
        const linkedInCollection = dbObj.collection("linkedInCollection");
        const jobTrackingCollection = dbObj.collection("jobTrackingCollection");
        const testsCollection = dbObj.collection("testsCollection");

        app.set("usersCollection", usersCollection);
        app.set("jobsCollection", jobsCollection);
        app.set("linkedInCollection", linkedInCollection);
        app.set("jobTrackingCollection", jobTrackingCollection);
        app.set("testsCollection", testsCollection);

        console.log("Connection to database successful");
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });

app.use(express.json());

app.use(cors());

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, "../client/dist")));

// API routes
const userApp = require("./apis/user-api");
const adminApp = require("./apis/admin-api");
const jobApp = require("./apis/job-api");
const testApp = require("./apis/test-api");

app.use("/user-api", userApp);
app.use('/admin-api',adminApp);
app.use("/job-api", jobApp);
app.use('/test-api', testApp);

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error encountered:", err);
    res.status(500).send({ errorMessage: err.message || "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});

