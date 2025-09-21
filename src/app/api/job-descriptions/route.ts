import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// POST /api/job-descriptions - Save job description and ATS result
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resumeId, jobTitle, company, description, atsResult } = body;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: 'user@example.com'
        }
      });
    }

    // Verify user owns the resume
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        user: { clerkUserId: userId }
      }
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Create job description record
    const jobDescription = await prisma.jobDescription.create({
      data: {
        userId: user.id,
        resumeId: resumeId,
        jobTitle: jobTitle || 'Untitled Job',
        company: company || 'Unknown Company',
        description: description || '',
        atsResult: atsResult || {}
      }
    });

    return NextResponse.json({ jobDescription });
  } catch (error) {
    console.error('Error saving job description:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/job-descriptions - Get job descriptions for user
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: 'user@example.com'
        }
      });
    }

    // Get job descriptions
    const jobDescriptions = await prisma.jobDescription.findMany({
      where: { userId: user.id },
      include: { resume: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ jobDescriptions });
  } catch (error) {
    console.error('Error fetching job descriptions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
