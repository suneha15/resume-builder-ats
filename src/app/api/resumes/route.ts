import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/resumes - Get all resumes for user
export async function GET() {
  try {
    const { userId } = await auth();
    let actualUserId: string | null | undefined = userId;
    
    // If auth() doesn't work, try currentUser()
    if (!actualUserId) {
      const user = await currentUser();
      actualUserId = user?.id;
    }
    
    if (!actualUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkUserId: actualUserId },
      include: { 
        resumes: {
          orderBy: { updatedAt: 'desc' }
        }
      }
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          clerkUserId: actualUserId,
          email: 'user@example.com' // Will be updated when we get user info
        },
        include: { 
          resumes: {
            orderBy: { updatedAt: 'desc' }
          }
        }
      });
    }

    return NextResponse.json({ resumes: user.resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/resumes - Create new resume
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    console.log('API Route - User ID from auth():', userId);
    
    let actualUserId: string | null | undefined = userId;
    
    // If auth() doesn't work, try currentUser()
    if (!actualUserId) {
      console.log('API Route - Trying currentUser() as fallback...');
      const user = await currentUser();
      actualUserId = user?.id;
      console.log('API Route - User ID from currentUser():', actualUserId);
    }
    
    // If still no userId, try extracting from headers
    if (!actualUserId) {
      console.log('API Route - Trying to extract userId from headers...');
      const authToken = request.headers.get('x-clerk-auth-token');
      if (authToken) {
        try {
          // Decode JWT token to get user ID
          const payload = JSON.parse(atob(authToken.split('.')[1]));
          actualUserId = payload.sub;
          console.log('API Route - User ID from JWT token:', actualUserId);
        } catch (e) {
          console.log('API Route - Failed to decode JWT token:', e);
        }
      }
    }
    
    console.log('API Route - Final User ID:', actualUserId);
    
    if (!actualUserId) {
      console.log('API Route - No userId found, returning 401');
      return NextResponse.json({ error: 'Unauthorized - Please sign in to save resumes' }, { status: 401 });
    }

    const body = await request.json();
    const { title, personalInfo, experiences, education, skills, summary, jobDescription, aiSuggestions } = body;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkUserId: actualUserId }
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          clerkUserId: actualUserId,
          email: 'user@example.com' // Will be updated when we get user info
        }
      });
    }

    // Create resume
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: title || 'Untitled Resume',
        personalInfo: personalInfo || {},
        experiences: experiences || [],
        education: education || [],
        skills: skills || [],
        summary: summary || '',
        jobDescription: jobDescription || '',
        aiSuggestions: aiSuggestions || ''
      }
    });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
