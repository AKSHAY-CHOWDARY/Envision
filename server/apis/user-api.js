const exp = require("express");
const userApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const profile_key = process.env.LINKEDIN_PROFILE_API_KEY;
const { exec } = require("child_process");
const bodyParser = require("body-parser");
require("dotenv").config();
//body parser
userApp.use(exp.json());

let userCollectionObj, linkedInObj,jobsObj;

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
	//let filters = req.body; take when implementing filters
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


// Resume generation endpoint
userApp.post("/generate-resume", (req, res) => {
    const { userData, additionalData } = req.body;

    // Extracting the necessary data from the LinkedIn profile object
    const fullName = userData.fullName;
    const firstName = userData.first_name;
    const lastName = userData.last_name;
    const headline = userData.headline;
    const location = userData.location.trim();
    const about = userData.about;
    const connections = userData.connections;
    const followers = userData.followers;
    const profilePhoto = userData.profile_photo;
    const backgroundCoverImage = userData.background_cover_image_url;
    const education = userData.education && userData.education[0] ? userData.education[0].degree : 'N/A';
    
    const projects = additionalData.projects || 'N/A';
    const courses = additionalData.courses || 'N/A';
    const certifications = additionalData.certifications || 'N/A';
    const skills = additionalData.skills || 'N/A';
    const extracurriculars = additionalData.extracurriculars || 'N/A';

    const latexTemplate = `
    \\documentclass[a4paper, 12pt]{article}
    \\usepackage{graphicx}
    \\usepackage{hyperref}
    \\begin{document}

    % Title Section
    \\title{\\textbf{Resume}}
    \\author{\\textbf{${fullName}}}
    \\date{}
    \\maketitle

    % Profile Image Section
    % \\begin{figure}[h!]
    %     \\centering
    %     \\includegraphics[width=0.2\\textwidth]{${profilePhoto}}
    % \\end{figure}

    % Personal Details Section
    \\section*{Personal Information}
    \\begin{itemize}
        \\item \\textbf{Full Name:} ${fullName}
        \\item \\textbf{Headline:} ${headline}
        \\item \\textbf{Location:} ${location}
        \\item \\textbf{About Me:} ${about}
        \\item \\textbf{Connections:} ${connections}
        \\item \\textbf{Followers:} ${followers}
    \\end{itemize}

    % Education Section
    \\section*{Education}
    \\begin{itemize}
        \\item \\textbf{Degree:} ${education}
    \\end{itemize}

    % Projects Section
    \\section*{Projects}
    \\begin{itemize}
        \\item ${projects}
    \\end{itemize}

    % Courses and Certifications Section
    \\section*{Courses and Certifications}
    \\begin{itemize}
        \\item ${courses}
        \\item ${certifications}
    \\end{itemize}

    % Skills Section
    \\section*{Skills}
    \\begin{itemize}
        \\item ${skills}
    \\end{itemize}

    % Extracurriculars Section
    \\section*{Extracurriculars}
    \\begin{itemize}
        \\item ${extracurriculars}
    \\end{itemize}

    % Closing
    \\end{document}
    `;

  
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
  });


module.exports = userApp;
