import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Experience {
  company: string;
  position: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  gpa?: string;
  startDate?: string;
  endDate?: string;
}

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    console.log('AI Enhance API called');
    console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
    
    const { personalInfo, experiences, education, skills, jobDescription, sectionType, currentData } = await request.json();
    
    console.log('Request data:', { sectionType, jobDescription: jobDescription?.substring(0, 100) + '...', personalInfo });

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';
    let suggestions = '';

    if (sectionType) {
      // Section-specific suggestions
      const studentName = personalInfo?.firstName ? `${personalInfo.firstName} ${personalInfo.lastName}` : 'the student';
      
      if (sectionType === 'experience') {
        prompt = `
        You are helping a student aged 12-16 create their first resume. They want to apply for this job:

        Job Description:
        ${jobDescription}

        Current Experience Data:
        ${JSON.stringify(currentData || [])}

        Student Info:
        Name: ${studentName}
        Age Range: 12-16 years old

        Please provide specific, encouraging suggestions for the EXPERIENCE section. Remember:
        - They may not have formal work experience yet
        - Include suggestions for volunteer work, school projects, internships, part-time jobs, babysitting, leadership roles
        - Focus on transferable skills and achievements
        - Use age-appropriate language
        - Be encouraging and helpful
        - Suggest specific bullet points they could write
        - Mention how to highlight relevant experience even if it's not traditional "work"

        Format your response as actionable tips and specific examples they can use.
        `;
      } else if (sectionType === 'education') {
        prompt = `
        You are helping a student aged 12-16 create their first resume. They want to apply for this job:

        Job Description:
        ${jobDescription}

        Current Education Data:
        ${JSON.stringify(currentData || [])}

        Student Info:
        Name: ${studentName}
        Age Range: 12-16 years old

        Please provide specific, encouraging suggestions for the EDUCATION section. Remember:
        - They are likely in high school or middle school
        - Include suggestions for relevant coursework, projects, academic achievements
        - Mention GPA, honors, extracurricular activities
        - Focus on how their education relates to the job requirements
        - Use age-appropriate language
        - Be encouraging and helpful
        - Suggest specific ways to present their education

        Format your response as actionable tips and specific examples they can use.
        `;
      } else if (sectionType === 'skills') {
        prompt = `
        You are helping a student aged 12-16 create their first resume. They want to apply for this job:

        Job Description:
        ${jobDescription}

        Current Skills Data:
        ${JSON.stringify(currentData || [])}

        Student Info:
        Name: ${studentName}
        Age Range: 12-16 years old

        Please provide specific, encouraging suggestions for the SKILLS section. Remember:
        - Include both technical and soft skills
        - Computer skills, programming languages, soft skills
        - Hobbies and interests that show relevant skills
        - Languages they speak
        - Focus on skills mentioned in the job description
        - Use age-appropriate language
        - Be encouraging and helpful
        - Suggest specific skills they might have

        Format your response as actionable tips and specific examples they can use.
        `;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      suggestions = response.text();
    } else {
      // General resume enhancement (existing functionality)
      let resumeText = '';
      
      // Personal info
      resumeText += `${personalInfo.firstName} ${personalInfo.lastName}\n`;
      resumeText += `${personalInfo.email} ${personalInfo.phone}\n`;
      resumeText += `${personalInfo.location}\n`;
      if (personalInfo.linkedin) resumeText += `LinkedIn: ${personalInfo.linkedin}\n`;
      if (personalInfo.website) resumeText += `Website: ${personalInfo.website}\n`;
      resumeText += '\n';

      // Experience
      resumeText += 'EXPERIENCE\n';
      experiences.forEach((exp: Experience) => {
        if (exp.company && exp.position) {
          resumeText += `${exp.position} at ${exp.company}\n`;
          if (exp.description) resumeText += `${exp.description}\n`;
          resumeText += '\n';
        }
      });

      // Education
      resumeText += 'EDUCATION\n';
      education.forEach((edu: Education) => {
        if (edu.institution && edu.degree) {
          resumeText += `${edu.degree} in ${edu.field} from ${edu.institution}\n`;
          if (edu.gpa) resumeText += `GPA: ${edu.gpa}\n`;
          resumeText += '\n';
        }
      });

      // Skills
      resumeText += 'SKILLS\n';
      skills.forEach((skill: Skill) => {
        if (skill.name) {
          resumeText += `${skill.name} (${skill.level})\n`;
        }
      });

      const generalPrompt = `
      I have a resume and a job description. Please analyze the resume and provide specific suggestions to improve it for this particular job. Focus on:

      1. Missing keywords from the job description that should be added
      2. Better ways to phrase existing experience to match job requirements
      3. Skills that should be highlighted or added
      4. Any formatting or content improvements

      Resume:
      ${resumeText}

      Job Description:
      ${jobDescription}

      Please provide your suggestions in a clear, actionable format with specific recommendations.
      `;

      const result = await model.generateContent(generalPrompt);
      const response = await result.response;
      suggestions = response.text();
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error in AI enhancement:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI suggestions' },
      { status: 500 }
    );
  }
}

