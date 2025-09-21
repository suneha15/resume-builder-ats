// Test database connection
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test creating a user
    const testUser = await prisma.user.create({
      data: {
        clerkUserId: 'test-user-123',
        email: 'test@example.com'
      }
    });
    console.log('✅ Test user created:', testUser.id);
    
    // Test creating a resume
    const testResume = await prisma.resume.create({
      data: {
        userId: testUser.id,
        title: 'Test Resume',
        personalInfo: { firstName: 'John', lastName: 'Doe' },
        experiences: [],
        education: [],
        skills: [],
        summary: 'Test summary',
        jobDescription: 'Test job description',
        aiSuggestions: 'Test AI suggestions'
      }
    });
    console.log('✅ Test resume created:', testResume.id);
    
    // Clean up test data
    await prisma.resume.delete({ where: { id: testResume.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('✅ Test data cleaned up');
    
    console.log('🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
