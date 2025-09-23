'use client';

import {
  Box,
  HStack,
  Heading,
  Text,
  Textarea,
  Button,
  Badge,
  VStack,
} from '@chakra-ui/react';
import { FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
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

interface ATSResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

interface ATSScannerProps {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  jobDescription: string;
  setJobDescription: (value: string) => void;
}

export default function ATSScanner({
  personalInfo,
  experiences,
  education,
  skills,
  jobDescription,
  setJobDescription
}: ATSScannerProps) {
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');

  // Generate resume text for ATS scanning
  useEffect(() => {
    const generateResumeText = () => {
      let text = '';
      
      // Personal info
      text += `${personalInfo.firstName} ${personalInfo.lastName}\n`;
      text += `${personalInfo.email} ${personalInfo.phone}\n`;
      text += `${personalInfo.location}\n`;
      if (personalInfo.linkedin) text += `LinkedIn: ${personalInfo.linkedin}\n`;
      if (personalInfo.website) text += `Website: ${personalInfo.website}\n`;
      text += '\n';

      // Experience
      text += 'EXPERIENCE\n';
      experiences.forEach(exp => {
        if (exp.company && exp.position) {
          text += `${exp.position} at ${exp.company}\n`;
          if (exp.description) text += `${exp.description}\n`;
          text += '\n';
        }
      });

      // Education
      text += 'EDUCATION\n';
      education.forEach(edu => {
        if (edu.institution && edu.degree) {
          text += `${edu.degree} in ${edu.field} from ${edu.institution}\n`;
          if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
          text += '\n';
        }
      });

      // Skills
      text += 'SKILLS\n';
      skills.forEach(skill => {
        if (skill.name) {
          text += `${skill.name} (${skill.level})\n`;
        }
      });

      setResumeText(text);
    };

    generateResumeText();
  }, [personalInfo, experiences, education, skills]);

  const scanATS = async () => {
    if (!jobDescription.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ats-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription
        })
      });

      const result = await response.json();
      setAtsResult(result);
    } catch (error) {
      console.error('Error scanning ATS:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent ATS compatibility!';
    if (score >= 60) return 'Good ATS compatibility, some improvements needed.';
    return 'Poor ATS compatibility, significant improvements needed.';
  };

  return (
    <Box>
      <Box mb={6}>
        <Heading size="md" mb={4}>ATS Scanner</Heading>
        <Text color="gray.600" mb={4}>
          Paste a job description below to analyze how well your resume matches the requirements.
          The ATS scanner will identify matching keywords and suggest improvements.
        </Text>
      </Box>

      <Box p={4} bg="white" border="1px" borderColor="gray.200" borderRadius="md" mb={6}>
        <Box>
          <Text fontWeight="semibold" mb={4}>Job Description</Text>
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            mb={4}
          />
          <Button
            onClick={scanATS}
            loading={loading}
            colorScheme="brand"
            disabled={!jobDescription.trim()}
          >
            <HStack gap={2}>
              <FaSearch />
              <Text>Scan Resume</Text>
            </HStack>
          </Button>
        </Box>
      </Box>

      {atsResult && (
        <Box p={4} bg="white" border="1px" borderColor="gray.200" borderRadius="md">
          <Box>
            {/* Score Display */}
            <Box textAlign="center" mb={6}>
              <Heading size="lg" mb={2}>
                ATS Compatibility Score
              </Heading>
              <Box
                w="100%"
                h="20px"
                bg="gray.200"
                borderRadius="md"
                mb={2}
                position="relative"
                overflow="hidden"
              >
                <Box
                  w={`${atsResult.score}%`}
                  h="100%"
                  bg={getScoreColor(atsResult.score) === 'green' ? 'green.400' : 
                      getScoreColor(atsResult.score) === 'yellow' ? 'yellow.400' : 'red.400'}
                  borderRadius="md"
                  transition="width 0.3s ease"
                />
              </Box>
              <HStack justify="center" gap={4}>
                <Badge
                  colorScheme={getScoreColor(atsResult.score)}
                  variant="solid"
                  fontSize="lg"
                  px={4}
                  py={2}
                >
                  {atsResult.score}%
                </Badge>
                <Text fontWeight="semibold" color={getScoreColor(atsResult.score) + '.500'}>
                  {getScoreMessage(atsResult.score)}
                </Text>
              </HStack>
            </Box>

            <Box height="1px" bg="gray.200" mb={6} />

            {/* Matched Keywords */}
            <Box mb={6}>
              <Heading size="md" mb={3}>Matched Keywords</Heading>
              {atsResult.matchedKeywords.length > 0 ? (
                <HStack gap={2} flexWrap="wrap">
                  {atsResult.matchedKeywords.map((keyword, index) => (
                    <Badge key={index} colorScheme="green" variant="subtle">
                      <HStack gap={1}>
                        <FaCheck size={10} />
                        <Text>{keyword}</Text>
                      </HStack>
                    </Badge>
                  ))}
                </HStack>
              ) : (
                <Text color="gray.500">No keywords matched</Text>
              )}
            </Box>

            {/* Missing Keywords */}
            <Box mb={6}>
              <Heading size="md" mb={3}>Missing Keywords</Heading>
              {atsResult.missingKeywords.length > 0 ? (
                <HStack gap={2} flexWrap="wrap">
                  {atsResult.missingKeywords.map((keyword, index) => (
                    <Badge key={index} colorScheme="red" variant="subtle">
                      <HStack gap={1}>
                        <FaTimes size={10} />
                        <Text>{keyword}</Text>
                      </HStack>
                    </Badge>
                  ))}
                </HStack>
              ) : (
                <Text color="gray.500">All important keywords are present!</Text>
              )}
            </Box>

            {/* Suggestions */}
            {atsResult.suggestions.length > 0 && (
              <Box>
                <Heading size="md" mb={3}>Suggestions for Improvement</Heading>
                <Box
                  p={4}
                  bg="blue.50"
                  border="1px"
                  borderColor="blue.200"
                  borderRadius="md"
                >
                  <Box>
                    <Text fontWeight="semibold" color="blue.800" mb={2}>
                      Improve your ATS score by:
                    </Text>
                    <VStack gap={1} mt={2} alignItems="start">
                      {atsResult.suggestions.map((suggestion, index) => (
                        <HStack key={index} gap={2}>
                          <FaCheck color="blue.500" size={12} />
                          <Text>{suggestion}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
