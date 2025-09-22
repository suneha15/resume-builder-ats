'use client';

import {
  Box,
  HStack,
  Heading,
  Text,
  Badge
} from '@chakra-ui/react';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface ResumePreviewProps {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  aiSuggestions: string;
  onEdit?: () => void;
  onDownload?: () => void;
}

export default function ResumePreview({
  personalInfo,
  experiences,
  education,
  skills,
  aiSuggestions,
  onEdit,
  onDownload
}: ResumePreviewProps) {

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'green';
      case 'Advanced': return 'blue';
      case 'Intermediate': return 'yellow';
      case 'Beginner': return 'gray';
      default: return 'gray';
    }
  };


  return (
    <Box>

      {/* AI Suggestions */}
      {aiSuggestions && (
        <Box
          p={4}
          bg="blue.50"
          border="1px"
          borderColor="blue.200"
          borderRadius="md"
          mb={6}
        >
          <Box>
            <Text fontWeight="semibold" color="blue.800" mb={2}>
              AI Suggestions
            </Text>
            <Text color="blue.700">
              {aiSuggestions}
            </Text>
          </Box>
        </Box>
      )}

      {/* Resume Content */}
      <Box
        data-resume-preview
        className="resume-content"
        p={8}
        bg="white"
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        shadow="md"
        maxW="8.5in"
        mx="auto"
        fontFamily="serif"
        fontSize="sm"
        lineHeight="1.4"
        color="gray.800"
      >
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Heading size="lg" textAlign="center" mb={2}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Heading>
          <HStack gap={4} fontSize="sm" color="gray.600" justify="center" mb={2}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>• {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>• {personalInfo.location}</Text>}
          </HStack>
          <HStack gap={4} fontSize="sm" justify="center">
            {personalInfo.linkedin && (
              <Text color="blue.500">LinkedIn: {personalInfo.linkedin}</Text>
            )}
            {personalInfo.website && (
              <Text color="blue.500">Website: {personalInfo.website}</Text>
            )}
          </HStack>
        </Box>

        <Box height="1px" bg="gray.200" mb={6} />

        {/* Experience Section */}
        {experiences.some(exp => exp.company && exp.position) && (
          <Box mb={6}>
            <Heading size="md" mb={4} color="brand.500" textTransform="uppercase" fontSize="md">
              Professional Experience
            </Heading>
            <Box>
              {experiences
                .filter(exp => exp.company && exp.position)
                .map((exp, index) => (
                  <Box key={exp.id}>
                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="bold" fontSize="md">
                        {exp.position}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </Text>
                    </HStack>
                    <Text fontWeight="semibold" color="brand.500" mb={2}>
                      {exp.company}
                    </Text>
                    {exp.description && (
                      <Text fontSize="sm" whiteSpace="pre-wrap">
                        {exp.description}
                      </Text>
                    )}
                    {index < experiences.filter(e => e.company && e.position).length - 1 && (
                      <Box height="1px" bg="gray.200" mt={3} />
                    )}
                  </Box>
                ))}
            </Box>
          </Box>
        )}

        {/* Education Section */}
        {education.some(edu => edu.institution && edu.degree) && (
          <Box mb={6}>
            <Heading size="md" mb={4} color="brand.500" textTransform="uppercase" fontSize="md">
              Education
            </Heading>
            <Box>
              {education
                .filter(edu => edu.institution && edu.degree)
                .map((edu, index) => (
                  <Box key={edu.id}>
                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="bold" fontSize="md">
                        {edu.degree} in {edu.field}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </Text>
                    </HStack>
                    <Text fontWeight="semibold" color="brand.500" mb={1}>
                      {edu.institution}
                    </Text>
                    {edu.gpa && (
                      <Text fontSize="sm" color="gray.600">
                        GPA: {edu.gpa}
                      </Text>
                    )}
                    {index < education.filter(e => e.institution && e.degree).length - 1 && (
                      <Box height="1px" bg="gray.200" mt={3} />
                    )}
                  </Box>
                ))}
            </Box>
          </Box>
        )}

        {/* Skills Section */}
        {skills.some(skill => skill.name) && (
          <Box>
            <Heading size="md" mb={4} color="brand.500" textTransform="uppercase" fontSize="md">
              Skills
            </Heading>
            <HStack gap={2} flexWrap="wrap">
              {skills
                .filter(skill => skill.name)
                .map((skill) => (
                  <Badge
                    key={skill.id}
                    colorScheme={getSkillColor(skill.level)}
                    variant="subtle"
                    px={3}
                    py={1}
                  >
                    {skill.name} ({skill.level})
                  </Badge>
                ))}
            </HStack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
