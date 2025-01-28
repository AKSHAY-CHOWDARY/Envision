const express = require("express");
const testApp = express.Router();
const expressAsyncHandler = require("express-async-handler");
const axios = require("axios");
const { ObjectId } = require("mongodb");
const cors = require("cors");

// Initialize MongoDB collection reference
let testsCollectionObj;

// CORS middleware
testApp.use(cors());

// Database middleware
testApp.use((req, res, next) => {
    testsCollectionObj = req.app.get("testsCollection");
    if (!testsCollectionObj) {
        return res.status(500).json({ message: "Database connection not established" });
    }
    next();
});

// Input validation middleware
const validateQuizRequest = (req, res, next) => {
    const { jobrole, experience, userId } = req.body;
    
    if (!jobrole || !experience || !userId) {
        return res.status(400).json({ 
            message: "Missing required fields: jobrole, experience, or userId" 
        });
    }
    next();
};
//GENERATE QUESTIONS
testApp.post(
    "/generate-questions",
    expressAsyncHandler(async (req, res) => {

      /*  return res.status(201).json({
            message: "Questions generated and saved successfully",
            payload: {
                _id: "679918a9a86e6b18ebfe8df9",
                quiz: questions,
                userId:userId
            }
        });*/
        const { jobrole, experience, userId } = req.body;
        console.log(jobrole, experience, userId);
        console.log("REQUEST RECIEVED",req.body);   

        try {

            console.log("response otw");
            const response = await axios.post(
                "http://localhost:8000/generate-quiz",
                { jobrole, experience },{
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log("passed response");
            if (!response.data || !response.data.quiz) {
                return res.status(400).json({ 
                    message: "Invalid response from quiz generation service" 
                });
            }
            const questions = response.data.quiz;
            console.log("questions available");
            const dbRes = await testsCollectionObj.insertOne({
                quiz: questions,
                userId:userId,
                createdAt: new Date(),
                status: 'active'
            });
            console.log(dbRes);
            return res.status(201).json({
                message: "Questions generated and saved successfully",
                payload: {
                    _id: dbRes.insertedId,
                    quiz: questions,
                    userId:userId
                }
            });

        } catch (err) {
            if (axios.isAxiosError(err)) {
                return res.status(err.response?.status || 500).json({
                    message: "Quiz generation service error",
                    error: err.message
                });
            }

            return res.status(500).json({
                message: "Internal server error",
                error: err.message
            });
        }
    })
);
//BRO CHECK THE STATUS FIELD IN FRONTEND TO TELL IF THE TEST HAS ALREADY BEEN SUBMITTED
//SUBMIT ANSWERS As an ARRAY
testApp.post(
    "/submit-answers",
    expressAsyncHandler(async (req, res) => {
        const { testId, answers, userId } = req.body;
        console.log(testId);
        console.log(answers);

        try {
            const testObj = await testsCollectionObj.findOne({ _id: new ObjectId(testId), userId: userId });
            console.log(testObj);
            if (!testObj) {
                return res.status(404).json({ message: "Test not found" });
            }
            if (testObj.status !== 'active') {
                return res.status(400).json({ message: "Test has already been submitted" });
            }

            const correctAnswers = testObj.quiz.map((q) => q.correct);
            const score = answers.reduce((acc, ans, idx) => {
                return ans === correctAnswers[idx] ? acc + 1 : acc;
            }, 0);

            const dbRes = await testsCollectionObj.updateOne(
                { _id: testId, userId: userId },
                {
                    $set: {
                        status: 'completed',
                        answers,
                        score
                    }
                }
            );

            return res.status(200).json({
                message: "Test submitted successfully",
                payload: {
                    testId,
                    userId,
                    score
                }
            });

        } catch (err) {
            return res.status(500).json({
                message: "Internal server error",
                error: err.message
            });
        }
    })
);


module.exports = testApp;