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

let userCollectionObj, linkedInObj, jobsObj;

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
//jobs api
userApp.post(
	"/jobs",
	expressAsyncHandler(async (req, res) => {
		const { filters } = req.body;
		try {
			let query = {};

			// Add search filter
			if (filters?.search) {
				query.$or = [
					{ job_position: { $regex: filters.search, $options: "i" } },
					{ company_name: { $regex: filters.search, $options: "i" } },
				];
			}

			// Add location filter
			if (filters?.job_location) {
				query.job_location = filters.job_location;
			}

			// Add date filter
			if (filters?.job_posting_date && filters.job_posting_date !== "all") {
				const now = new Date();
				let dateLimit;

				switch (filters.job_posting_date) {
					case "last-24-hours":
						dateLimit = new Date(now - 24 * 60 * 60 * 1000);
						break;
					case "last-7-days":
						dateLimit = new Date(now - 7 * 24 * 60 * 60 * 1000);
						break;
					case "last-30-days":
						dateLimit = new Date(now - 30 * 24 * 60 * 60 * 1000);
						break;
				}

				if (dateLimit) {
					query.date = { $gte: dateLimit };
				}
			}
			let jobs = await jobsObj.find(query).toArray();

			// Handle sorting
			if (filters?.sortBy) {
				jobs.sort((a, b) => {
					const dateA = new Date(a.posted).getTime();
					const dateB = new Date(b.posted).getTime();
					return filters.sortBy === "latest" ? dateB - dateA : dateA - dateB;
				});
			}

			return res.send({ message: "All Jobs", payload: jobs });
		} catch (err) {
			console.error(err);
			return res.send({ message: `Error fetching jobs: ${err.message}` });
		}
	})
);

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
		console.log(url, userId);
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
			return res.send({
				message: "LinkedIn data saved",
				payload: linkedInData,
			});
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

userApp.post(
	"/generate-resume",
	expressAsyncHandler(async (req, res) => {
		const { userData, additionalData } = req.body;

		// Constructing the prompt
		const prompt = `
Enhance the user's resume details and return a valid JSON response *without any extra text or formatting*.
Add descriptions to projects and extracurriculars based on their titles and also add education which contains degree name ,institution and years details and change the about like career objective
and for certifications and courses add ATS friendly text about the certification and categorize the skills into programming languages,Frameworks, technologies and non technical skills if present.

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
			const aiResponse = await model.generateContent(prompt);
			let rawText = aiResponse.response.text().trim();

			// Extract only the JSON part
			const jsonMatch = rawText.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error("AI response does not contain valid JSON.");
			}

			let jsonText = jsonMatch[0];

			// Fix common JSON issues
			jsonText = jsonText
				.replace(/,\s*}/g, "}") // Remove trailing commas in objects
				.replace(/,\s*]/g, "]"); // Remove trailing commas in arrays

			const generatedResume = JSON.parse(jsonText);
			console.log("Generated Resume Data:", generatedResume);

			// Function to safely sanitize LaTeX special characters
			const sanitizeLatex = (input) => {
				if (typeof input !== "string") return ""; // Ensure only strings are processed
				return input
					.replace(/&/g, "\\&")
					.replace(/%/g, "\\%")
					.replace(/_/g, "\\_")
					.replace(/\$/g, "\\$")
					.replace(/#/g, "\\#")
					.replace(/{/g, "\\{")
					.replace(/}/g, "\\}")
					.replace(/\\/g, "\\textbackslash{}");
			};

			// Ensuring default values to prevent errors
			const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

			const latexTemplate = `
\\documentclass[a4paper, 12pt]{article}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{longtable} % For table formatting

\\begin{document}

% Title Section
\\title{\\textbf{Resume}}
\\author{\\textbf{${sanitizeLatex(userData.fullName)}}}
\\date{}
\\maketitle



% About
\\section*{About}
${sanitizeLatex(generatedResume.about || "")}

% Education Section
\\section*{Education}
\\renewcommand{\\arraystretch}{1.3} % Increases row height for better readability
\\begin{longtable}{|p{4cm}|p{7cm}|p{3cm}|} % Adjust column width
    \\hline
    \\textbf{Degree} & \\textbf{Institution} & \\textbf{Years} \\\\ 
    \\hline
    ${safeArray(generatedResume.education)
			.map(
				(edu) =>
					`${sanitizeLatex(edu.degree || "N/A")} & ${sanitizeLatex(
						edu.institution || "N/A"
					)} & ${sanitizeLatex(edu.years || "N/A")} \\\\ \\hline`
			)
			.join("\n")}
\\end{longtable}

% Certifications
\\section*{Certifications}
\\begin{itemize}
    ${safeArray(generatedResume.certifications)
			.map(
				(cert) =>
					`\\item \\textbf{${sanitizeLatex(
						cert.title || "Untitled"
					)}}: ${sanitizeLatex(cert.description || "No description")}`
			)
			.join("\n")}
\\end{itemize}

% Courses
\\section*{Courses}
\\begin{itemize}
    ${safeArray(generatedResume.courses)
			.map(
				(cou) =>
					`\\item \\textbf{${sanitizeLatex(
						cou.title || "Untitled"
					)}}: ${sanitizeLatex(cou.description || "No description")}`
			)
			.join("\n")}
\\end{itemize}

% Skills Section
\\section*{Skills}
\\begin{itemize}
    ${
			generatedResume.skills.programmingLanguages.length
				? `
    \\item \\textbf{Programming Languages:}
   
        ${generatedResume.skills.programmingLanguages
					.map((skill) => ` ${sanitizeLatex(skill)}`)
					.join(", ")}
 
    `
				: ""
		}

    ${
			generatedResume.skills.frameworks.length
				? `
    \\item \\textbf{Frameworks:}
    
        ${generatedResume.skills.frameworks
					.map((skill) => `${sanitizeLatex(skill)}`)
					.join(", ")}
  
    `
				: ""
		}

    ${
			generatedResume.skills.technologies.length
				? `
    \\item \\textbf{Technologies:}
    
        ${generatedResume.skills.technologies
					.map((skill) => ` ${sanitizeLatex(skill)}`)
					.join(", ")}
  
    `
				: ""
		}

    ${
			generatedResume.skills.nonTechnicalSkills.length
				? `
    \\item \\textbf{Non-Technical Skills:}
   
        ${generatedResume.skills.nonTechnicalSkills
					.map((skill) => ` ${sanitizeLatex(skill)}`)
					.join(", ")}
   
    `
				: ""
		}
\\end{itemize}

% Projects
\\section*{Projects}
\\begin{itemize}
    ${safeArray(generatedResume.projects)
			.map(
				(proj) =>
					`\\item \\textbf{${sanitizeLatex(
						proj.title || "Untitled"
					)}}: ${sanitizeLatex(proj.description || "No description")}`
			)
			.join("\n")}
\\end{itemize}


% Extracurriculars
\\section*{Extracurriculars}
\\begin{itemize}
    ${safeArray(generatedResume.extracurriculars)
			.map(
				(extra) =>
					`\\item \\textbf{${sanitizeLatex(
						extra.title || "Untitled"
					)}}: ${sanitizeLatex(extra.description || "No description")}`
			)
			.join("\n")}
\\end{itemize}

\\end{document}
`;

			console.log("Generated LaTeX Resume:", latexTemplate);

			fs.writeFileSync("resume.tex", latexTemplate);

			// Compile LaTeX to PDF
			exec("pdflatex resume.tex", (err, stdout, stderr) => {
				if (err) {
					console.error("Error generating PDF:", stderr); // <-- Log the error
					return res
						.status(500)
						.json({ error: "Error generating resume.", details: stderr });
				}

				const pdf = fs.readFileSync("resume.pdf");
				res.contentType("application/pdf").send(pdf);
				console.log("HRL");
			});
		} catch (err) {
			console.error("Error generating resume:", err);
			return res
				.status(500)
				.json({ error: "Error generating resume.", details: err });
		}
	})
);

userApp.post(
	"/recommend-courses",
	expressAsyncHandler(async (req, res) => {
		let { skills } = req.body;
		try {
			let response = await axios.post(
				"http://localhost:8000/recommend_courses",
				{ skills }
			);
			return res.send({
				message: "courses",
				payload: response.data.recommended_courses,
			});
		} catch (err) {
			return res
				.status(500)
				.json({ error: "Failed to fetch recommended courses" });
		}
	})
);

module.exports = userApp;
