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

   // Constructing a structured prompt
   const prompt = `
   Enhance the user's resume details and return a valid JSON response **without any extra text or formatting**.
   
   The JSON format:
   {
	   "fullName": "...",
	   "headline": "...",
	   "location": "...",
	   "about": "...",
	   "skills": ["...", "..."],
	   "education": ["...", "..."],
	   "projects": ["...", "..."],
	   "courses": ["...", "..."],
	   "certifications": ["...", "..."],
	   "extracurriculars": ["...", "..."]
   }

   Here is the raw user data:
   Name: ${userData.fullName}
   Headline: ${userData.headline}
   Location: ${userData.location}
   About: ${userData.about}
   Skills: ${JSON.stringify(additionalData.skills)}
   Education: ${JSON.stringify(userData.education)}
   Projects: ${JSON.stringify(additionalData.projects)}
   Courses: ${JSON.stringify(additionalData.courses)}
   Certifications: ${JSON.stringify(additionalData.certifications)}
   Extracurriculars: ${JSON.stringify(additionalData.extracurriculars)}
`;

try {
	const aiResponse = await model.generateContent(prompt);
	
	let rawText = aiResponse.response.text().trim();

	// **Extract only JSON part**
	const jsonMatch = rawText.match(/\{[\s\S]*\}/);
	if (!jsonMatch) {
		throw new Error("AI response does not contain valid JSON.");
	}

	let jsonText = jsonMatch[0];

	// **Fix common JSON issues**
	jsonText = jsonText
		.replace(/,\s*}/g, "}") // Remove trailing commas in objects
		.replace(/,\s*]/g, "]"); // Remove trailing commas in arrays

	const generatedResume = JSON.parse(jsonText);
	console.log("Generated Resume Data:", generatedResume);
// **Function to sanitize LaTeX special characters**
const sanitizeLatex = (str) => {
	return str.replace(/&/g, "\\&")
			  .replace(/%/g, "\\%")
			  .replace(/_/g, "\\_")
			  .replace(/\$/g, "\\$");
};
   // LaTeX Resume Template
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

   % About
        \\section*{About}
        ${generatedResume.about}
	
	
	 % Education
        \\section*{Education}
        \\begin{itemize}
        ${generatedResume.education.map(edu => `\\item ${edu}`).join("\n")}
        \\end{itemize}
		
	
% Skills
	\\section*{Skills}
	\\begin{itemize}
	${generatedResume.skills.map(skill => `\\item ${sanitizeLatex(skill)}`).join("\n")}
	\\end{itemize}

% Projects
        \\section*{Projects}
        \\begin{itemize}
        ${generatedResume.projects.map(project => `\\item ${sanitizeLatex(project)}`).join("\n")}
        \\end{itemize}

   % Extracurricular Activities
        \\section*{Extracurricular Activities}
        \\begin{itemize}
        ${generatedResume.extracurriculars.map(extra => `\\item ${sanitizeLatex(extra)}`).join("\n")}
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
		

    } catch (err) {
        console.error("Error generating resume:", err);
        return res.status(500).json({ error: "Error generating resume.", details: err });
    }
}));

module.exports = userApp;
