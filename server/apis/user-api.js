const exp = require("express");
const userApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const profile_key = process.env.LINKEDIN_PROFILE_API_KEY;
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");


require("dotenv").config();
//body parser
userApp.use(exp.json());

let userCollectionObj, linkedInObj,jobsObj;


const genAI = new GoogleGenerativeAI("AIzaSyCu1NGjpoWrseHN2JMBJ2O_LEwt-2CcaGI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

userApp.use((req, res, next) => {
	userCollectionObj = req.app.get("usersCollection");
	linkedInObj = req.app.get("linkedInCollection");
	jobsObj = req.app.get("jobsCollection");
	next();
});
// Load Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

//SAVE USER DATA TO DB
userApp.post(
	"/user",
	expressAsyncHandler(async (req, res) => {
		let newUser = req.body;
		try {
			let response = await userCollectionObj.insertOne(newUser);
			return res.send({ message: "User created", payload: response });
		} catch (err) {
			console.log(err);
			return res.send({ message: `User not created ${err}` });
		}
	})
);

//GET JOBS DATA FROM DB
// IM USING POST BECAUSE IT WILL HELP YOU TO IMPLEMENT SEARCH AND OTHER FILTERS FUNCTIONALITY
userApp.post('/jobs', expressAsyncHandler(async (req, res) => {
	let filters = req.body; 
	try {
		let response = await jobsObj.find({job_position:"Software Engineer"}).toArray()
		return res.send({ message: "All Jobs", payload: response });
	} catch (err) {
		console.log(err);
		return res.send({ message: `Jobs not created ${err}` });
	}
}));

//Send users LinkedIn data if present in DB
userApp.get(
	"/linkedIn/:id",
	expressAsyncHandler(async (req, res) => {
		let userId = req.params.id;
		try {
			let result = await linkedInObj.findOne({ userId: userId });
			if (result) {
				return res.send({
					message: "Users Linkedin data found",
					payload: result,
				});
			} else {
				return res.send({ message: "Users Linkedin data not found" });
			}
		} catch (err) {
			console.log(err);
			return res.send({ message: `User not found ${err}` });
		}
	})
);


//fetch LinkedIn data by scraping and save to DB if not present
userApp.post(
	"/linkedIn/:url",
	expressAsyncHandler(async (req, res) => {
		const url = req.params.url;
		const userId = req.body.userId;
		console.log(url,userId);
		try {
			let scrapingResponse = await axios.get(
				`https://api.scrapingdog.com/linkedin/?api_key=${profile_key}&type=profile&linkId=${url}`
			);
			console.log("public api called", scrapingResponse);

			if (
				scrapingResponse.data.success === false &&
				scrapingResponse.data.message ===
					"Unauthorized request, please make sure your API key is valid."
			) {
				return res.send({
					message:
						"Unauthorized request, please make sure your API key is valid.",
				});
			}
			let linkedInData = scrapingResponse.data;
			linkedInData[0].userId = userId;
			let response = await linkedInObj.insertMany(linkedInData);
			return res.send({ message: "LinkedIn data saved", payload: linkedInData });
		} catch (err) {

			console.log(err);

			// Handle specific error for protected scraping
			if (
				err.response &&
				err.response.status === 400 &&
				err.response.data.message.includes("use private=true")
			) {
				console.log("protected scraping executing");
				try {
					let protectedScrapingResponse = await axios.get(
						`https://api.scrapingdog.com/linkedin/?api_key=${profile_key}&type=profile&linkId=${url}&private=true`
					);
					console.log(protectedScrapingResponse);
					if (protectedScrapingResponse.data.success === true) {
						let linkedInData = protectedScrapingResponse.data;
						linkedInData.userId = userId;
						let response = await linkedInObj.insertOne(linkedInData);
						return res.send({
							message: "LinkedIn data saved",
							payload: response,
						});
					} else {
						return res.send({ message: "LinkedIn data not found" });
					}
				} catch (protectedErr) {
					console.log(protectedErr);
					return res.send({
						message: `Protected scraping error ${protectedErr}`,
					});
				}
			} else {
				return res.send({ message: `Scraping error ${err}` });
			}
		}
	})
);

userApp.post("/generate-resume", expressAsyncHandler(async (req, res) => {
    const { userData, additionalData } = req.body;

    // Construct the prompt for generating the resume content
    const prompt = `
        enhance the below information provided for resume:
        Name: ${userData.fullName}
        Headline: ${userData.headline}
        Location: ${userData.location}
        About: ${userData.about}
        Skills: ${additionalData.skills}
        Education: ${userData.education}
        Projects: ${additionalData.projects}
        Courses: ${additionalData.courses}
        Certifications: ${additionalData.certifications}
        Extracurriculars: ${additionalData.extracurriculars}
    `;

    try {
        // Assuming the Gemini model has a 'generate()' or equivalent method
        const aiResponse = await model.generateContent(
            prompt
            // Adjust based on the desired response length
        );

        const resumeContent = aiResponse.response.text();  // Assuming the text is in 'text' field
		console.log(resumeContent);
        // Use the generated content in your LaTeX resume template
        const latexTemplate = `
        \\documentclass[a4paper, 12pt]{article}
    \\usepackage{graphicx}
    \\usepackage{hyperref}
    \\begin{document}

    % Title Section
    \\title{\\textbf{Resume}}
    \\author{\\textbf{${userData.fullName}}}
    \\date{}
    \\maketitle

    ${resumeContent} 
   
    % Closing
    \\end{document}`
    ;



        fs.writeFileSync("resume.tex", latexTemplate);

		  // Compile LaTeX to PDF
		  exec("pdflatex resume.tex", (err, stdout, stderr) => {
			if (err) {
			  console.error("Error generating PDF:", stderr);  // <-- Log the error
			  return res.status(500).json({ error: "Error generating resume.", details: stderr });
			}
			
			const pdf = fs.readFileSync("resume.pdf");
			res.contentType("application/pdf").send(pdf);
		  });
		

    } catch (err) {
        console.error("Error generating resume:", err);
        return res.status(500).json({ error: "Error generating resume.", details: err });
    }
}));

module.exports = userApp;
