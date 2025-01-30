import { jsPDF } from 'jspdf';

export function generateInterviewPDF(answers, analyses, overallFeedback) {
  const pdf = new jsPDF();
  let yPos = 20;
  
  // Title
  pdf.setFontSize(20);
  pdf.text('Interview Assessment Report', 20, yPos);
  
  // Overall Score
  yPos += 20;
  pdf.setFontSize(16);
  pdf.text(`Overall Score: ${overallFeedback.score}/100`, 20, yPos);
  
  // General Feedback
  yPos += 15;
  pdf.setFontSize(14);
  pdf.text('General Feedback', 20, yPos);
  
  // Strengths
  yPos += 10;
  pdf.setFontSize(12);
  pdf.text('Strengths:', 25, yPos);
  overallFeedback.strengths.forEach(strength => {
    yPos += 7;
    pdf.text(`• ${strength}`, 30, yPos);
  });
  
  // Areas for Improvement
  yPos += 15;
  pdf.text('Areas for Improvement:', 25, yPos);
  overallFeedback.improvements.forEach(improvement => {
    yPos += 7;
    pdf.text(`• ${improvement}`, 30, yPos);
  });
  
  // Detailed Analysis
  answers.forEach((answer, index) => {
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    yPos += 15;
    pdf.setFontSize(14);
    pdf.text(`Question ${index + 1}:`, 20, yPos);
    yPos += 7;
    pdf.setFontSize(12);
    pdf.text(answer.question, 25, yPos);
    
    yPos += 10;
    const analysis = analyses[index];
    pdf.text(`Scores:`, 25, yPos);
    yPos += 7;
    pdf.text(`• Relevance: ${analysis.relevance}/10`, 30, yPos);
    yPos += 7;
    pdf.text(`• Clarity: ${analysis.clarity}/10`, 30, yPos);
    yPos += 7;
    pdf.text(`• Confidence: ${analysis.confidence}/10`, 30, yPos);
  });
  
  return pdf;
}