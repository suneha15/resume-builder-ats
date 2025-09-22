const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function showResumes() {
  try {
    console.log('📊 RESUMES TABLE DATA\n');
    console.log('=' .repeat(80));
    
    // Get all resumes with user info
    const resumes = await prisma.resume.findMany({
      include: {
        user: {
          select: {
            email: true,
            clerkUserId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (resumes.length === 0) {
      console.log('❌ No resumes found in the database.');
      return;
    }

    console.log(`📋 Found ${resumes.length} resume(s):\n`);

    resumes.forEach((resume, index) => {
      console.log(`🔹 Resume #${index + 1}`);
      console.log(`   ID: ${resume.id}`);
      console.log(`   Title: ${resume.title}`);
      console.log(`   User: ${resume.user.email} (${resume.user.clerkUserId})`);
      console.log(`   Created: ${resume.createdAt.toLocaleString()}`);
      console.log(`   Updated: ${resume.updatedAt.toLocaleString()}`);
      
      if (resume.atsScore) {
        console.log(`   ATS Score: ${resume.atsScore}`);
      }
      
      if (resume.personalInfo && typeof resume.personalInfo === 'object') {
        const personalInfo = resume.personalInfo;
        if (personalInfo.firstName || personalInfo.lastName) {
          console.log(`   Name: ${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim());
        }
        if (personalInfo.email) {
          console.log(`   Email: ${personalInfo.email}`);
        }
      }
      
      if (resume.summary) {
        console.log(`   Summary: ${resume.summary.substring(0, 100)}${resume.summary.length > 100 ? '...' : ''}`);
      }
      
      console.log('   ' + '-'.repeat(60));
    });

    // Show table structure
    console.log('\n📋 TABLE STRUCTURE:');
    console.log('┌─────────────────┬─────────────────────────────────────────────────┐');
    console.log('│ Column          │ Description                                     │');
    console.log('├─────────────────┼─────────────────────────────────────────────────┤');
    console.log('│ id              │ Unique identifier (UUID)                        │');
    console.log('│ user_id         │ Foreign key to users table                      │');
    console.log('│ title           │ Resume title                                    │');
    console.log('│ personal_info   │ JSON: Personal information                      │');
    console.log('│ experiences     │ JSON: Work experiences array                    │');
    console.log('│ education       │ JSON: Education array                           │');
    console.log('│ skills          │ JSON: Skills array                              │');
    console.log('│ summary         │ Resume summary text                             │');
    console.log('│ job_description │ Target job description                          │');
    console.log('│ ai_suggestions  │ AI-generated suggestions                        │');
    console.log('│ ats_score       │ ATS compatibility score                         │');
    console.log('│ created_at      │ Creation timestamp                              │');
    console.log('│ updated_at      │ Last update timestamp                           │');
    console.log('└─────────────────┴─────────────────────────────────────────────────┘');

  } catch (error) {
    console.error('❌ Error fetching resumes:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

showResumes();
