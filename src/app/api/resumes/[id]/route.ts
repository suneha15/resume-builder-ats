import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/resumes/[id] - Get specific resume
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    let actualUserId: string | null | undefined = userId;

    // If auth() doesn't work, try currentUser()
    if (!actualUserId) {
      const user = await currentUser();
      actualUserId = user?.id;
    }

    // If still no userId, try extracting from headers
    if (!actualUserId) {
      const authToken = request.headers.get('x-clerk-auth-token');
      if (authToken) {
        try {
          // Decode JWT token to get user ID
          const payload = JSON.parse(atob(authToken.split('.')[1]));
          actualUserId = payload.sub;
        } catch (e) {
          console.log('Failed to decode JWT token:', e);
        }
      }
    }

    if (!actualUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns this resume
    const resume = await prisma.resume.findFirst({
      where: {
        id: id,
        user: { clerkUserId: actualUserId }
      }
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/resumes/[id] - Update resume
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    let actualUserId: string | null | undefined = userId;

    // If auth() doesn't work, try currentUser()
    if (!actualUserId) {
      const user = await currentUser();
      actualUserId = user?.id;
    }

    // If still no userId, try extracting from headers
    if (!actualUserId) {
      const authToken = request.headers.get('x-clerk-auth-token');
      if (authToken) {
        try {
          // Decode JWT token to get user ID
          const payload = JSON.parse(atob(authToken.split('.')[1]));
          actualUserId = payload.sub;
        } catch (e) {
          console.log('Failed to decode JWT token:', e);
        }
      }
    }

    if (!actualUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, personalInfo, experiences, education, skills, summary, jobDescription, aiSuggestions, atsScore } = body;

    // Verify user owns this resume
    const existingResume = await prisma.resume.findFirst({
      where: {
        id: id,
        user: { clerkUserId: actualUserId }
      }
    });

    if (!existingResume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Update resume
    const updatedResume = await prisma.resume.update({
      where: { id: id },
      data: {
        title: title || existingResume.title,
        personalInfo: personalInfo || existingResume.personalInfo,
        experiences: experiences || existingResume.experiences,
        education: education || existingResume.education,
        skills: skills || existingResume.skills,
        summary: summary !== undefined ? summary : existingResume.summary,
        jobDescription: jobDescription !== undefined ? jobDescription : existingResume.jobDescription,
        aiSuggestions: aiSuggestions !== undefined ? aiSuggestions : existingResume.aiSuggestions,
        atsScore: atsScore !== undefined ? atsScore : existingResume.atsScore,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ resume: updatedResume });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/resumes/[id] - Delete resume
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    let actualUserId: string | null | undefined = userId;

    // If auth() doesn't work, try currentUser()
    if (!actualUserId) {
      const user = await currentUser();
      actualUserId = user?.id;
    }

    // If still no userId, try extracting from headers
    if (!actualUserId) {
      const authToken = request.headers.get('x-clerk-auth-token');
      if (authToken) {
        try {
          // Decode JWT token to get user ID
          const payload = JSON.parse(atob(authToken.split('.')[1]));
          actualUserId = payload.sub;
        } catch (e) {
          console.log('Failed to decode JWT token:', e);
        }
      }
    }

    if (!actualUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns this resume
    const resume = await prisma.resume.findFirst({
      where: {
        id: id,
        user: { clerkUserId: actualUserId }
      }
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Delete resume
    await prisma.resume.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
