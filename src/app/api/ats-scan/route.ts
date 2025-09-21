import { NextRequest, NextResponse } from 'next/server';

interface ATSResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

function extractKeywords(text: string): string[] {
  // Remove common words and extract meaningful keywords
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word))
    .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
}

function calculateSimilarity(resumeKeywords: string[], jobKeywords: string[]): number {
  const resumeSet = new Set(resumeKeywords);
  const jobSet = new Set(jobKeywords);
  
  const intersection = new Set([...resumeSet].filter(x => jobSet.has(x)));
  const union = new Set([...resumeSet, ...jobSet]);
  
  return (intersection.size / union.size) * 100;
}

function generateSuggestions(missingKeywords: string[], matchedKeywords: string[]): string[] {
  const suggestions: string[] = [];
  
  if (missingKeywords.length > 0) {
    suggestions.push(`Add these missing keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  
  if (matchedKeywords.length < 5) {
    suggestions.push('Include more relevant keywords from the job description');
  }
  
  if (missingKeywords.length > matchedKeywords.length) {
    suggestions.push('Focus on matching more keywords from the job requirements');
  }
  
  suggestions.push('Use action verbs to describe your achievements');
  suggestions.push('Quantify your accomplishments with specific numbers and metrics');
  suggestions.push('Ensure your skills section matches the job requirements');
  
  return suggestions;
}

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      );
    }

    // Extract keywords from both texts
    const resumeKeywords = extractKeywords(resumeText);
    const jobKeywords = extractKeywords(jobDescription);

    // Find matched and missing keywords
    const resumeSet = new Set(resumeKeywords);
    const jobSet = new Set(jobKeywords);
    
    const matchedKeywords = [...jobSet].filter(keyword => resumeSet.has(keyword));
    const missingKeywords = [...jobSet].filter(keyword => !resumeSet.has(keyword));

    // Calculate ATS score
    const score = Math.round(calculateSimilarity(resumeKeywords, jobKeywords));

    // Generate suggestions
    const suggestions = generateSuggestions(missingKeywords, matchedKeywords);

    const result: ATSResult = {
      score,
      matchedKeywords,
      missingKeywords,
      suggestions
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in ATS scanning:', error);
    return NextResponse.json(
      { error: 'Failed to scan resume' },
      { status: 500 }
    );
  }
}

