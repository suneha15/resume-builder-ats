'use client';

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  HStack,
  SimpleGrid,
  Badge,
  IconButton
} from '@chakra-ui/react';
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs';
import { FaPlus, FaEdit, FaTrash, FaDownload, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useNotificationContext } from '@/contexts/NotificationContext';

interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

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

interface Resume {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  atsScore?: number;
  personalInfo?: PersonalInfo;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { addNotification } = useNotificationContext();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchResumes();
    }
  }, [isLoaded, user]);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes');
      if (response.ok) {
        const { resumes } = await response.json();
        setResumes(resumes || []);
      } else if (response.status === 401) {
        // User not authenticated - this is normal, just show empty state
        console.log('User not authenticated, showing empty state');
        setResumes([]);
      } else {
        console.error('Error fetching resumes:', response.status, response.statusText);
        setResumes([]);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/resumes/${resumeId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setResumes(resumes.filter(resume => resume.id !== resumeId));
        } else {
          console.error('Error deleting resume');
        }
      } catch (error) {
        console.error('Error deleting resume:', error);
      }
    }
  };

  const handlePreviewResume = (resumeId: string) => {
    // Open resume builder in preview mode
    window.open(`/resume-builder?resumeId=${resumeId}&preview=true`, '_blank');
  };

  const handleDownloadResume = async (resumeId: string) => {
    try {
      // Fetch the resume data
      const response = await fetch(`/api/resumes/${resumeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resume');
      }
      
      const { resume } = await response.json();
      
      // Generate PDF using the same logic as in resume builder
      const jsPDF = (await import('jspdf')).default;
      const pdf = new jsPDF();
      
      // Set up fonts and styling
      pdf.setFont('helvetica');
      
      // Add header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${resume.personalInfo?.firstName || 'First'} ${resume.personalInfo?.lastName || 'Last'}`, 20, 30);
      
      // Add contact information
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      let yPosition = 50;
      
      if (resume.personalInfo?.email) {
        pdf.text(`Email: ${resume.personalInfo.email}`, 20, yPosition);
        yPosition += 8;
      }
      if (resume.personalInfo?.phone) {
        pdf.text(`Phone: ${resume.personalInfo.phone}`, 20, yPosition);
        yPosition += 8;
      }
      if (resume.personalInfo?.location) {
        pdf.text(`Location: ${resume.personalInfo.location}`, 20, yPosition);
        yPosition += 8;
      }
      if (resume.personalInfo?.linkedin) {
        pdf.text(`LinkedIn: ${resume.personalInfo.linkedin}`, 20, yPosition);
        yPosition += 8;
      }
      if (resume.personalInfo?.website) {
        pdf.text(`Website: ${resume.personalInfo.website}`, 20, yPosition);
        yPosition += 8;
      }
      
      yPosition += 10;
      
      // Add a line separator
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, 190, yPosition);
      yPosition += 15;
      
      // Add Professional Experience
      if (resume.experiences && resume.experiences.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PROFESSIONAL EXPERIENCE', 20, yPosition);
        yPosition += 12;
        
        resume.experiences.forEach((exp: Experience) => {
          if (exp.company && exp.position) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${exp.position}`, 20, yPosition);
            yPosition += 8;
            
            pdf.setFont('helvetica', 'normal');
            pdf.text(`${exp.company}`, 20, yPosition);
            yPosition += 6;
            
            // Add date range
            const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
            const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '');
            const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';
            if (dateRange) {
              pdf.text(dateRange, 20, yPosition);
              yPosition += 6;
            }
            
            if (exp.description) {
              pdf.setFontSize(10);
              const splitDescription = pdf.splitTextToSize(exp.description, 170);
              pdf.text(splitDescription, 20, yPosition);
              yPosition += splitDescription.length * 4 + 8;
            }
            yPosition += 5;
          }
        });
      }
      
      // Add Education
      if (resume.education && resume.education.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EDUCATION', 20, yPosition);
        yPosition += 12;
        
        resume.education.forEach((edu: Education) => {
          if (edu.institution && edu.degree) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${edu.degree}`, 20, yPosition);
            yPosition += 8;
            
            pdf.setFont('helvetica', 'normal');
            pdf.text(`${edu.institution}`, 20, yPosition);
            yPosition += 6;
            
            if (edu.field) {
              pdf.text(`Field: ${edu.field}`, 20, yPosition);
              yPosition += 6;
            }
            
            if (edu.gpa) {
              pdf.text(`GPA: ${edu.gpa}`, 20, yPosition);
              yPosition += 6;
            }
            
            // Add date range
            const startDate = edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
            const endDate = edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
            const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';
            if (dateRange) {
              pdf.text(dateRange, 20, yPosition);
              yPosition += 6;
            }
            
            yPosition += 8;
          }
        });
      }
      
      // Add Skills
      if (resume.skills && resume.skills.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SKILLS', 20, yPosition);
        yPosition += 12;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Group skills by level
        const skillsByLevel = resume.skills.reduce((acc: Record<string, string[]>, skill: any) => {
          if (!acc[skill.level]) acc[skill.level] = [];
          acc[skill.level].push(skill.name);
          return acc;
        }, {} as Record<string, string[]>);
        
        Object.entries(skillsByLevel).forEach(([level, skillNames]) => {
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${level}:`, 20, yPosition);
          yPosition += 6;
          
          pdf.setFont('helvetica', 'normal');
          const skillText = (skillNames as string[]).join(', ');
          const splitSkills = pdf.splitTextToSize(skillText, 170);
          pdf.text(splitSkills, 25, yPosition);
          yPosition += splitSkills.length * 4 + 8;
        });
      }
      
      // Add AI Suggestions if available
      if (resume.aiSuggestions) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AI SUGGESTIONS', 20, yPosition);
        yPosition += 12;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const splitSuggestions = pdf.splitTextToSize(resume.aiSuggestions, 170);
        pdf.text(splitSuggestions, 20, yPosition);
      }
      
      // Download the PDF
      const fileName = `${resume.personalInfo?.firstName || 'Resume'}_${resume.personalInfo?.lastName || 'Document'}_Resume.pdf`;
      pdf.save(fileName);
      
      console.log('PDF generated successfully:', fileName);
      addNotification({
        title: 'PDF Downloaded Successfully!',
        description: 'Your resume has been downloaded successfully.',
        status: 'success',
        duration: 4000,
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      addNotification({
        title: 'PDF Generation Failed',
        description: `Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (!isLoaded) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <SignedOut>
        <Box textAlign="center" py={20}>
          <Heading size="lg" color="gray.500" mb={6}>
            Please sign in to access the dashboard
          </Heading>
        </Box>
      </SignedOut>
      <SignedIn>
      {/* Header */}
      <Box bg="white" shadow="sm" py={4}>
        <Container maxW="container.xl">
          <HStack justifyContent="space-between">
            <Heading size="lg" color="brand.500">
              My Resumes
            </Heading>
            <Link href="/resume-builder">
              <Button colorScheme="brand">
                <HStack gap={2}>
                  <FaPlus />
                  <Text>Create New Resume</Text>
                </HStack>
              </Button>
            </Link>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {loading ? (
          <Box textAlign="center" py={20}>
            <Text>Loading your resumes...</Text>
          </Box>
        ) : resumes.length === 0 ? (
          <Box textAlign="center" py={20}>
            <Heading size="lg" color="gray.500" mb={6}>
              No resumes yet
            </Heading>
            <Text color="gray.600" mb={6}>
              Create your first professional resume with AI assistance
            </Text>
            <Link href="/resume-builder">
              <Button size="lg" colorScheme="brand">
                <HStack gap={2}>
                  <FaPlus />
                  <Text>Create Your First Resume</Text>
                </HStack>
              </Button>
            </Link>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {resumes.map((resume) => (
              <Box key={resume.id} bg="white" p={6} borderRadius="md" shadow="md" _hover={{ shadow: 'lg' }}>
                <Box mb={4}>
                  <HStack justifyContent="space-between" mb={4}>
                    <Heading size="md">{resume.title}</Heading>
                    {resume.atsScore && (
                      <Badge 
                        colorScheme={resume.atsScore >= 80 ? 'green' : resume.atsScore >= 60 ? 'yellow' : 'red'}
                        variant="solid"
                      >
                        {resume.atsScore}% ATS
                      </Badge>
                    )}
                  </HStack>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </Text>
                  <HStack gap={2}>
                    <Link href={`/resume-builder?resumeId=${resume.id}`}>
                      <Button size="sm" variant="outline">
                        <HStack gap={2}>
                          <FaEdit />
                          <Text>Edit</Text>
                        </HStack>
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => handlePreviewResume(resume.id)}>
                      <HStack gap={2}>
                        <FaEye />
                        <Text>Preview</Text>
                      </HStack>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadResume(resume.id)}>
                      <HStack gap={2}>
                        <FaDownload />
                        <Text>Download</Text>
                      </HStack>
                    </Button>
                    <IconButton
                      aria-label="Delete resume"
                      children={<FaTrash />}
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => handleDeleteResume(resume.id)}
                    />
                  </HStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
      </SignedIn>
    </Box>
  );
}
