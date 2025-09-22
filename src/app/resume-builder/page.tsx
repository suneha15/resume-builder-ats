'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack
} from '@chakra-ui/react';
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs';
import { FaArrowLeft, FaSave, FaEye, FaDownload, FaRobot, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ATSScanner from '@/components/ATSScanner';
import ResumePreview from '@/components/ResumePreview';
import { useNotificationContext } from '@/contexts/NotificationContext';

type Section = 'contact' | 'job-description' | 'experience' | 'education' | 'skills' | 'summary' | 'ats' | 'preview';

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
  gpa?: string;
  startDate: string;
  endDate: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

// Experience Form Component
function ExperienceForm({ 
  experience, 
  onSave, 
  onCancel 
}: { 
  experience: Experience | null; 
  onSave: (data: Omit<Experience, 'id'>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    company: experience?.company || '',
    position: experience?.position || '',
    startDate: experience?.startDate || '',
    endDate: experience?.endDate || '',
    current: experience?.current || false,
    description: experience?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.company && formData.position) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4} alignItems="stretch">
        <HStack gap={4}>
          <Box flex={1}>
            <Text mb={2} fontWeight="semibold">Company *</Text>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              placeholder="Company name"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </Box>
          <Box flex={1}>
            <Text mb={2} fontWeight="semibold">Position *</Text>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              placeholder="Job title"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </Box>
        </HStack>
        
        <HStack gap={4}>
          <Box flex={1}>
            <Text mb={2} fontWeight="semibold">Start Date</Text>
            <input
              type="month"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </Box>
          <Box flex={1}>
            <Text mb={2} fontWeight="semibold">End Date</Text>
            <input
              type="month"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              disabled={formData.current}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                opacity: formData.current ? 0.5 : 1
              }}
            />
          </Box>
        </HStack>

        <Box>
          <HStack gap={2} mb={2}>
            <input
              type="checkbox"
              checked={formData.current}
              onChange={(e) => setFormData({...formData, current: e.target.checked, endDate: e.target.checked ? '' : formData.endDate})}
              style={{ marginRight: '8px' }}
            />
            <Text fontSize="sm">I currently work here</Text>
          </HStack>
        </Box>

        <Box>
          <Text mb={2} fontWeight="semibold">Description</Text>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe your responsibilities and achievements..."
            rows={4}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </Box>

        <HStack gap={2} justifyContent="flex-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="brand">
            {experience ? 'Update Experience' : 'Add Experience'}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

// Education Form Component
function EducationForm({ 
  education, 
  onSave, 
  onCancel 
}: { 
  education: Education | null; 
  onSave: (data: Omit<Education, 'id'>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    institution: education?.institution || '',
    degree: education?.degree || '',
    field: education?.field || '',
    gpa: education?.gpa || '',
    startDate: education?.startDate || '',
    endDate: education?.endDate || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.institution && formData.degree) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4} alignItems="stretch">
        <HStack gap={4}>
          <Box flex={1}>
            <Text mb={2} fontWeight="semibold">Institution *</Text>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({...formData, institution: e.target.value})}
              placeholder="School or university name"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </Box>
          <Box flex={1}>
            <Text mb={2} fontWeight="semibold">Degree *</Text>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({...formData, degree: e.target.value})}
              placeholder="High School Diploma, Bachelor's, etc."
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </Box>
        </HStack>
        
        <HStack gap={4}>
          <Box flex={1}>
            <Text mb={2} fontWeight="semibold">Field of Study</Text>
            <input
              type="text"
              value={formData.field}
              onChange={(e) => setFormData({...formData, field: e.target.value})}
              placeholder="Mathematics, Science, etc."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </Box>
          <Box flex={1}>
            <Text mb={2} fontWeight="semibold">GPA</Text>
            <input
              type="text"
              value={formData.gpa}
              onChange={(e) => setFormData({...formData, gpa: e.target.value})}
              placeholder="3.5"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </Box>
        </HStack>

        <HStack gap={4}>
          <Box flex={1}>
            <Text mb={2} fontWeight="semibold">Start Date</Text>
            <input
              type="month"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </Box>
          <Box flex={1}>
            <Text mb={2} fontWeight="semibold">End Date</Text>
            <input
              type="month"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </Box>
        </HStack>

        <HStack gap={2} justifyContent="flex-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="brand">
            {education ? 'Update Education' : 'Add Education'}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}

// Skill Form Component
function SkillForm({ 
  skill, 
  onSave, 
  onCancel 
}: { 
  skill: Skill | null; 
  onSave: (data: Omit<Skill, 'id'>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
    name: skill?.name || '',
    level: skill?.level || 'Beginner'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4} alignItems="stretch">
        <Box>
          <Text mb={2} fontWeight="semibold">Skill Name *</Text>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Microsoft Excel, Leadership, Spanish"
            required
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </Box>

        <Box>
          <Text mb={2} fontWeight="semibold">Skill Level</Text>
          <select
            value={formData.level}
            onChange={(e) => setFormData({...formData, level: e.target.value as Skill['level']})}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </Box>

        <HStack gap={2} justifyContent="flex-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="brand">
            {skill ? 'Update Skill' : 'Add Skill'}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}

export default function ResumeBuilder() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const { addNotification } = useNotificationContext();
  
  // Form state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phone: '',
    location: '',
    linkedin: '',
    website: ''
  });

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [currentSection, setCurrentSection] = useState<Section>('contact');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [isNewResume, setIsNewResume] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const [aiSuggestionsForSection, setAiSuggestionsForSection] = useState<string>('');
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showAddExperienceForm, setShowAddExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [showAddEducationForm, setShowAddEducationForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Check for preview mode from URL parameters and load resume data
  useEffect(() => {
    const isPreviewMode = searchParams.get('preview') === 'true';
    const resumeId = searchParams.get('resumeId');
    
    if (isPreviewMode && resumeId) {
      setCurrentSection('preview');
      loadResumeForPreview(resumeId);
    }
  }, [searchParams]);

  // Load resume data for preview
  const loadResumeForPreview = async (resumeId: string) => {
    console.log('Loading resume for preview, ID:', resumeId);
    setIsLoadingPreview(true);
    try {
      const response = await fetch(`/api/resumes/${resumeId}`);
      console.log('Preview fetch response:', response.status);
      
      if (response.ok) {
        const { resume } = await response.json();
        console.log('Resume data received:', resume);
        
        // Clear any existing data first
        setPersonalInfo({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          website: ''
        });
        setExperiences([]);
        setEducation([]);
        setSkills([]);
        setJobDescription('');
        setAiSuggestions('');
        
        // Load the resume data into the form
        if (resume.personalInfo) {
          console.log('Setting personal info:', resume.personalInfo);
          setPersonalInfo(resume.personalInfo);
        }
        if (resume.experiences) {
          console.log('Setting experiences:', resume.experiences);
          setExperiences(resume.experiences);
        }
        if (resume.education) {
          console.log('Setting education:', resume.education);
          setEducation(resume.education);
        }
        if (resume.skills) {
          console.log('Setting skills:', resume.skills);
          setSkills(resume.skills);
        }
        if (resume.jobDescription) {
          console.log('Setting job description:', resume.jobDescription);
          setJobDescription(resume.jobDescription);
        }
        if (resume.aiSuggestions) {
          console.log('Setting AI suggestions:', resume.aiSuggestions);
          setAiSuggestions(resume.aiSuggestions);
        }
        
        // Set the resume as not new (so save button works correctly)
        setCurrentResumeId(resumeId);
        setIsNewResume(false);
        
        console.log('Resume loaded for preview successfully');
        setSaveStatus('Resume loaded for preview');
      } else {
        console.error('Failed to load resume for preview, status:', response.status);
        addNotification({
          title: 'Preview Failed',
          description: 'Failed to load resume for preview. Please try again.',
          status: 'error',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error loading resume for preview:', error);
      addNotification({
        title: 'Preview Error',
        description: 'Error loading resume for preview. Please try again.',
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Clear AI suggestions when switching sections
  useEffect(() => {
    setAiSuggestionsForSection('');
  }, [currentSection]);

  // Track unsaved changes for each section
  const markSectionAsChanged = (section: string) => {
    setUnsavedChanges(prev => new Set(prev).add(section));
  };

  const markSectionAsSaved = (section: string) => {
    setUnsavedChanges(prev => {
      const newSet = new Set(prev);
      newSet.delete(section);
      return newSet;
    });
  };


  // Load data from localStorage on component mount (fallback) - but not in preview mode
  useEffect(() => {
    const isPreviewMode = searchParams.get('preview') === 'true';
    if (isPreviewMode) {
      // Don't load from localStorage in preview mode - let the preview data load instead
      return;
    }
    
    const savedData = localStorage.getItem('resume-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.personalInfo) setPersonalInfo(parsedData.personalInfo);
        if (parsedData.experiences) setExperiences(parsedData.experiences);
        if (parsedData.education) setEducation(parsedData.education);
        if (parsedData.skills) setSkills(parsedData.skills);
        if (parsedData.jobDescription) setJobDescription(parsedData.jobDescription);
        if (parsedData.aiSuggestions) setAiSuggestions(parsedData.aiSuggestions);
        if (parsedData.currentSection) setCurrentSection(parsedData.currentSection);
        if (parsedData.currentResumeId) setCurrentResumeId(parsedData.currentResumeId);
        if (parsedData.isNewResume !== undefined) setIsNewResume(parsedData.isNewResume);
        setSaveStatus('Data loaded from previous session');
      } catch (error) {
        console.error('Error loading saved data:', error);
        setSaveStatus('Error loading saved data');
      }
    }
  }, [searchParams]);

  // Auto-save data to localStorage whenever form data changes
  useEffect(() => {
    const resumeData = {
      personalInfo,
      experiences,
      education,
      skills,
      jobDescription,
      aiSuggestions,
      currentSection,
      currentResumeId,
      isNewResume,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('resume-data', JSON.stringify(resumeData));
  }, [personalInfo, experiences, education, skills, jobDescription, aiSuggestions, currentSection, currentResumeId, isNewResume]);

  // Save current section data to localStorage
  const saveCurrentSection = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      // Always save to localStorage first
      const resumeData = {
        personalInfo,
        experiences,
        education,
        skills,
        jobDescription,
        aiSuggestions,
        currentSection,
        currentResumeId,
        isNewResume,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem('resume-data', JSON.stringify(resumeData));
      
      // Mark section as saved
      markSectionAsSaved(currentSection);
      setSaveStatus(`${currentSection} section saved to local storage!`);
      
      // Optionally save to database (but don't fail if it doesn't work)
      try {
        if (isNewResume) {
          // Create new resume in database
          const response = await fetch('/api/resumes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              personalInfo,
              experiences,
              education,
              skills,
              jobDescription,
              aiSuggestions
            })
          });

          if (response.ok) {
            const { resume } = await response.json();
            setCurrentResumeId(resume.id);
            setIsNewResume(false);
            setSaveStatus(`${currentSection} section saved locally and to database!`);
          }
        } else if (currentResumeId) {
          // Update existing resume in database
          const response = await fetch(`/api/resumes/${currentResumeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              personalInfo,
              experiences,
              education,
              skills,
              jobDescription,
              aiSuggestions
            })
          });

          if (response.ok) {
            setSaveStatus(`${currentSection} section saved locally and to database!`);
          }
        }
      } catch (dbError) {
        console.log('Database save failed, but local save succeeded:', dbError);
        // Don't show error to user since local save worked
      }
      
    } catch (error) {
      console.error('Error saving section:', error);
      setSaveStatus(`Error saving ${currentSection} section`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Handle section navigation with save prompt
  const handleSectionChange = async (newSection: Section) => {
    if (unsavedChanges.has(currentSection)) {
      const shouldSave = confirm(`You have unsaved changes in the ${currentSection} section. Would you like to save before continuing?`);
      if (shouldSave) {
        await saveCurrentSection();
      }
    }
    setCurrentSection(newSection);
  };

  const sections = [
    { id: 'contact', label: 'CONTACT' },
    { id: 'job-description', label: 'JOB DESCRIPTION' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'education', label: 'EDUCATION' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'summary', label: 'SUMMARY' },
    { id: 'ats', label: 'ATS SCANNER' },
    { id: 'preview', label: 'FINISH UP & PREVIEW' }
  ];

  // Experience management functions
  const addExperience = () => {
    setShowAddExperienceForm(true);
    setEditingExperience(null);
  };

  const editExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setShowAddExperienceForm(true);
  };

  const deleteExperience = (experienceId: string) => {
    setExperiences(experiences.filter(exp => exp.id !== experienceId));
    markSectionAsChanged('experience');
  };

  const saveExperience = (experienceData: Omit<Experience, 'id'>) => {
    if (editingExperience) {
      // Update existing experience
      setExperiences(experiences.map(exp => 
        exp.id === editingExperience.id 
          ? { ...experienceData, id: editingExperience.id }
          : exp
      ));
    } else {
      // Add new experience
      const newExperience: Experience = {
        ...experienceData,
        id: Date.now().toString()
      };
      setExperiences([...experiences, newExperience]);
    }
    
    setShowAddExperienceForm(false);
    setEditingExperience(null);
    markSectionAsChanged('experience');
  };

  const cancelExperienceForm = () => {
    setShowAddExperienceForm(false);
    setEditingExperience(null);
  };

  // Education management functions
  const addEducation = () => {
    setShowAddEducationForm(true);
    setEditingEducation(null);
  };

  const editEducation = (education: Education) => {
    setEditingEducation(education);
    setShowAddEducationForm(true);
  };

  const deleteEducation = (educationId: string) => {
    setEducation(education.filter(edu => edu.id !== educationId));
    markSectionAsChanged('education');
  };

  const saveEducation = (educationData: Omit<Education, 'id'>) => {
    if (editingEducation) {
      // Update existing education
      setEducation(education.map(edu => 
        edu.id === editingEducation.id 
          ? { ...educationData, id: editingEducation.id }
          : edu
      ));
    } else {
      // Add new education
      const newEducation: Education = {
        ...educationData,
        id: Date.now().toString()
      };
      setEducation([...education, newEducation]);
    }
    
    setShowAddEducationForm(false);
    setEditingEducation(null);
    markSectionAsChanged('education');
  };

  const cancelEducationForm = () => {
    setShowAddEducationForm(false);
    setEditingEducation(null);
  };

  // Skills management functions
  const addSkill = () => {
    setShowAddSkillForm(true);
    setEditingSkill(null);
  };

  const editSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setShowAddSkillForm(true);
  };

  const deleteSkill = (skillId: string) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
    markSectionAsChanged('skills');
  };

  const saveSkill = (skillData: Omit<Skill, 'id'>) => {
    if (editingSkill) {
      // Update existing skill
      setSkills(skills.map(skill => 
        skill.id === editingSkill.id 
          ? { ...skillData, id: editingSkill.id }
          : skill
      ));
    } else {
      // Add new skill
      const newSkill: Skill = {
        ...skillData,
        id: Date.now().toString()
      };
      setSkills([...skills, newSkill]);
    }
    
    setShowAddSkillForm(false);
    setEditingSkill(null);
    markSectionAsChanged('skills');
  };

  const cancelSkillForm = () => {
    setShowAddSkillForm(false);
    setEditingSkill(null);
  };

  // Generate AI suggestions based on job description
  const generateAISuggestions = async (sectionType: 'experience' | 'education' | 'skills') => {
    if (!jobDescription.trim()) {
      setAiSuggestionsForSection('Please add a job description first to get AI suggestions!');
      return;
    }

    setIsGeneratingSuggestions(true);
    try {
      const response = await fetch('/api/ai-enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionType,
          jobDescription,
          currentData: sectionType === 'experience' ? experiences : 
                     sectionType === 'education' ? education : skills,
          personalInfo
        }),
      });

      if (response.ok) {
        const { suggestions } = await response.json();
        setAiSuggestionsForSection(suggestions);
      } else {
        setAiSuggestionsForSection('Error generating suggestions. Please try again.');
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      setAiSuggestionsForSection('Error generating suggestions. Please try again.');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // Load resume from database
  const loadResume = async (resumeId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/resumes/${resumeId}`);
      if (response.ok) {
        const { resume } = await response.json();
        setPersonalInfo(resume.personalInfo || {});
        setExperiences(resume.experiences || []);
        setEducation(resume.education || []);
        setSkills(resume.skills || []);
        setJobDescription(resume.jobDescription || '');
        setAiSuggestions(resume.aiSuggestions || '');
        setCurrentResumeId(resumeId);
        setIsNewResume(false);
        setSaveStatus('Resume loaded successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Error loading resume');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      setSaveStatus('Error loading resume');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Save resume to database
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const resumeData = {
        title: `${personalInfo.firstName} ${personalInfo.lastName} - Resume` || 'Untitled Resume',
        personalInfo,
        experiences,
        education,
        skills,
        summary: aiSuggestions,
        jobDescription,
        aiSuggestions
      };

      let response;
      if (isNewResume) {
        // Create new resume
        response = await fetch('/api/resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resumeData)
        });
      } else {
        // Update existing resume
        response = await fetch(`/api/resumes/${currentResumeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resumeData)
        });
      }

      if (response.ok) {
        const { resume } = await response.json();
        setCurrentResumeId(resume.id);
        setIsNewResume(false);
        setSaveStatus('Resume saved to database successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
        
        // Show success toast
        addNotification({
          title: 'Resume Saved Successfully!',
          description: 'Your resume has been saved to your account. You can access it anytime from your dashboard.',
          status: 'success',
          duration: 4000,
        });
      } else {
        const errorData = await response.json();
        setSaveStatus(`Error saving resume: ${errorData.error || 'Unknown error'}`);
        setTimeout(() => setSaveStatus(''), 5000);
        addNotification({
          title: 'Save Failed',
          description: `Error saving resume: ${errorData.error || 'Unknown error'}`,
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      setSaveStatus('Error saving resume - check your database connection');
      setTimeout(() => setSaveStatus(''), 5000);
      addNotification({
        title: 'Connection Error',
        description: 'Error saving resume - check your database connection. Please try again.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearStorage = () => {
    if (confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
      localStorage.removeItem('resume-data');
      setPersonalInfo({
        firstName: '',
        lastName: '',
        email: user?.emailAddresses[0]?.emailAddress || '',
        phone: '',
        location: '',
        linkedin: '',
        website: ''
      });
      setExperiences([]);
      setEducation([]);
      setSkills([]);
      setJobDescription('');
      setAiSuggestions('');
      setCurrentSection('contact');
      setCurrentResumeId(null);
      setIsNewResume(true);
      setSaveStatus('All data cleared');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Create new resume
  const handleNewResume = () => {
    if (confirm('Create a new resume? Any unsaved changes will be lost.')) {
      setPersonalInfo({
        firstName: '',
        lastName: '',
        email: user?.emailAddresses[0]?.emailAddress || '',
        phone: '',
        location: '',
        linkedin: '',
        website: ''
      });
      setExperiences([]);
      setEducation([]);
      setSkills([]);
      setJobDescription('');
      setAiSuggestions('');
      setCurrentSection('contact');
      setCurrentResumeId(null);
      setIsNewResume(true);
      setSaveStatus('New resume addNotificationd');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log('Previewing resume...');
  };

  const handleDownload = async () => {
    // Skip html2canvas entirely due to CSS parsing issues and go straight to text-based PDF
    try {
      console.log('Generating PDF and attempting to save to database...');
      
      let databaseSaveSuccess = false;
      let saveMessage = '';
      
      // First, try to save the resume to the database
      try {
        const resumeData = {
          title: `${personalInfo.firstName || 'Resume'} ${personalInfo.lastName || 'Document'}`,
          personalInfo,
          experiences,
          education,
          skills,
          summary: aiSuggestions,
          jobDescription,
          aiSuggestions
        };

        const response = await fetch('/api/resumes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resumeData),
        }).catch(fetchError => {
          console.error('Fetch error:', fetchError);
          throw new Error(`Network error: ${fetchError.message}`);
        });

        if (response.ok) {
          const { resume } = await response.json();
          console.log('Resume saved to database:', resume.id);
          setCurrentResumeId(resume.id);
          setIsNewResume(false);
          databaseSaveSuccess = true;
          saveMessage = 'Resume PDF downloaded and saved to your account!';
        } else if (response.status === 401) {
          console.log('User not logged in - saving to local storage only');
          databaseSaveSuccess = false;
          saveMessage = 'Resume PDF downloaded! (Not saved to account - please sign in to save)';
        } else {
          console.error('Failed to save resume to database:', response.status);
          databaseSaveSuccess = false;
          saveMessage = 'Resume PDF downloaded! (Database save failed - saved locally)';
        }
      } catch (dbError) {
        console.error('Database save error:', dbError);
        databaseSaveSuccess = false;
        if (dbError.message.includes('Network error')) {
          saveMessage = 'Resume PDF downloaded! (Server unavailable - saved locally)';
        } else {
          saveMessage = 'Resume PDF downloaded! (Database unavailable - saved locally)';
        }
      }
      
      // Always save to local storage as backup
      try {
        const resumeData = {
          title: `${personalInfo.firstName || 'Resume'} ${personalInfo.lastName || 'Document'}`,
          personalInfo,
          experiences,
          education,
          skills,
          summary: aiSuggestions,
          jobDescription,
          aiSuggestions
        };
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
        console.log('Resume saved to local storage as backup');
      } catch (localError) {
        console.error('Failed to save to local storage:', localError);
      }
      
      // Import jsPDF library
      const jsPDF = (await import('jspdf')).default;
      const pdf = new jsPDF();
      
      // Set up fonts and styling
      pdf.setFont('helvetica');
      
      // Add header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${personalInfo.firstName || 'First'} ${personalInfo.lastName || 'Last'}`, 20, 30);
      
      // Add contact information
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      let yPosition = 50;
      
      if (personalInfo.email) {
        pdf.text(`Email: ${personalInfo.email}`, 20, yPosition);
        yPosition += 8;
      }
      if (personalInfo.phone) {
        pdf.text(`Phone: ${personalInfo.phone}`, 20, yPosition);
        yPosition += 8;
      }
      if (personalInfo.location) {
        pdf.text(`Location: ${personalInfo.location}`, 20, yPosition);
        yPosition += 8;
      }
      if (personalInfo.linkedin) {
        pdf.text(`LinkedIn: ${personalInfo.linkedin}`, 20, yPosition);
        yPosition += 8;
      }
      if (personalInfo.website) {
        pdf.text(`Website: ${personalInfo.website}`, 20, yPosition);
        yPosition += 8;
      }
      
      yPosition += 10;
      
      // Add a line separator
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, 190, yPosition);
      yPosition += 15;
      
      // Add Professional Experience
      if (experiences.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PROFESSIONAL EXPERIENCE', 20, yPosition);
        yPosition += 12;
        
        experiences.forEach(exp => {
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
      if (education.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EDUCATION', 20, yPosition);
        yPosition += 12;
        
        education.forEach(edu => {
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
      if (skills.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SKILLS', 20, yPosition);
        yPosition += 12;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Group skills by level
        const skillsByLevel = skills.reduce((acc, skill) => {
          if (!acc[skill.level]) acc[skill.level] = [];
          acc[skill.level].push(skill.name);
          return acc;
        }, {} as Record<string, string[]>);
        
        Object.entries(skillsByLevel).forEach(([level, skillNames]) => {
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${level}:`, 20, yPosition);
          yPosition += 6;
          
          pdf.setFont('helvetica', 'normal');
          const skillText = skillNames.join(', ');
          const splitSkills = pdf.splitTextToSize(skillText, 170);
          pdf.text(splitSkills, 25, yPosition);
          yPosition += splitSkills.length * 4 + 8;
        });
      }
      
      // Add AI Suggestions if available
      if (aiSuggestions) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AI SUGGESTIONS', 20, yPosition);
        yPosition += 12;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const splitSuggestions = pdf.splitTextToSize(aiSuggestions, 170);
        pdf.text(splitSuggestions, 20, yPosition);
      }
      
      // Download the PDF
      const fileName = `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || 'Document'}_Resume.pdf`;
      pdf.save(fileName);
      
      console.log('PDF generated successfully:', fileName);
      addNotification({
        title: 'PDF Downloaded Successfully!',
        description: 'Your resume has been downloaded and saved to your account.',
        status: 'success',
        duration: 4000,
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      addNotification({
        title: 'PDF Generation Failed',
        description: `Error generating PDF: ${error.message}. Please try again.`,
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
        <Container maxW="container.xl" py={20}>
          <Box
            p={6}
            borderRadius="md"
            bg="orange.50"
            border="1px"
            borderColor="orange.200"
          >
            <Text
              fontWeight="semibold"
              color="orange.800"
              mb={2}
            >
              Authentication Required
            </Text>
            <Text color="orange.700">
              Please sign in to access the resume builder.
            </Text>
          </Box>
        </Container>
      </SignedOut>

      <SignedIn>
        {/* Header */}
        <Box bg="white" shadow="sm" py={4}>
          <Container maxW="container.xl">
            <HStack justifyContent="space-between" mb={4}>
              <HStack gap={4}>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <HStack gap={2}>
                      <FaArrowLeft />
                      <Text>Back to Dashboard</Text>
                    </HStack>
                  </Button>
                </Link>
                <Heading size="md" color="brand.500">
                  Resume Builder
                </Heading>
              </HStack>
                     <HStack gap={2}>
                       <Button 
                         size="sm" 
                         variant="outline" 
                         onClick={handleSave}
                         loading={loading}
                       >
                         <HStack gap={2}>
                           <FaSave />
                           <Text>{isNewResume ? 'Save New Resume' : 'Save Changes'}</Text>
                         </HStack>
                       </Button>
                       <Button 
                         size="sm" 
                         variant="outline" 
                         colorScheme="green" 
                         onClick={handleNewResume}
                         disabled={loading}
                       >
                         New Resume
                       </Button>
                       <Button size="sm" variant="outline" onClick={handlePreview}>
                         <HStack gap={2}>
                           <FaEye />
                           <Text>Preview</Text>
                         </HStack>
                       </Button>
                       <Button size="sm" colorScheme="brand" onClick={handleDownload}>
                         <HStack gap={2}>
                           <FaDownload />
                           <Text>Download PDF</Text>
                         </HStack>
                       </Button>
                       <Button size="sm" variant="outline" colorScheme="red" onClick={handleClearStorage}>
                         Clear Data
                       </Button>
                     </HStack>
            </HStack>
            
            {/* Section Navigation */}
            <HStack gap={2} wrap="wrap">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={currentSection === section.id ? 'solid' : 'outline'}
                  colorScheme={currentSection === section.id ? 'brand' : 'gray'}
                  size="sm"
                  onClick={() => handleSectionChange(section.id as Section)}
                  position="relative"
                >
                  {section.label}
                  {unsavedChanges.has(section.id) && (
                    <Box
                      position="absolute"
                      top="-2px"
                      right="-2px"
                      w="8px"
                      h="8px"
                      bg="orange.400"
                      borderRadius="full"
                      border="2px solid white"
                      title="Unsaved changes"
                    />
                  )}
                  {jobDescription && ['experience', 'education', 'skills'].includes(section.id) && !unsavedChanges.has(section.id) && (
                    <Box
                      position="absolute"
                      top="-2px"
                      right="-2px"
                      w="8px"
                      h="8px"
                      bg="green.400"
                      borderRadius="full"
                      border="2px solid white"
                      title="AI suggestions available"
                    />
                  )}
                </Button>
              ))}
            </HStack>
          </Container>
        </Box>

        {/* Save Status */}
        {saveStatus && (
          <Container maxW="container.xl" py={2}>
            <Box
              p={4}
              borderRadius="md"
              bg={saveStatus.includes('Error') ? 'red.50' : 'green.50'}
              border="1px"
              borderColor={saveStatus.includes('Error') ? 'red.200' : 'green.200'}
            >
              <Text
                fontWeight="semibold"
                color={saveStatus.includes('Error') ? 'red.800' : 'green.800'}
                mb={1}
              >
                {saveStatus.includes('Error') ? 'Error' : 'Success'}
              </Text>
              <Text color={saveStatus.includes('Error') ? 'red.700' : 'green.700'}>
                {saveStatus}
              </Text>
            </Box>
          </Container>
        )}


        <Container maxW="container.xl" py={8}>
          {/* Dynamic Content Based on Selected Section */}
          {currentSection === 'contact' && (
            <Box bg="white" p={6} borderRadius="md" shadow="sm">
              <HStack justify="space-between" mb={6}>
                <Heading size="md">Contact Information</Heading>
                <Button
                  size="sm"
                  colorScheme="brand"
                  onClick={saveCurrentSection}
                  loading={isSaving}
                  disabled={!unsavedChanges.has('contact')}
                >
                  <HStack gap={2}>
                    <FaSave />
                    <Text>Save Section</Text>
                  </HStack>
                </Button>
              </HStack>
              <VStack gap={4} alignItems="stretch">
                <HStack gap={4}>
                  <Box flex={1}>
                    <Text mb={2} fontWeight="semibold">First Name</Text>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) => {
                        setPersonalInfo({...personalInfo, firstName: e.target.value});
                        markSectionAsChanged('contact');
                      }}
                      placeholder="Enter your first name"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </Box>
                  <Box flex={1}>
                    <Text mb={2} fontWeight="semibold">Last Name</Text>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) => {
                        setPersonalInfo({...personalInfo, lastName: e.target.value});
                        markSectionAsChanged('contact');
                      }}
                      placeholder="Enter your last name"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </Box>
                </HStack>
                <HStack gap={4}>
                  <Box flex={1}>
                    <Text mb={2} fontWeight="semibold">Email</Text>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => {
                        setPersonalInfo({...personalInfo, email: e.target.value});
                        markSectionAsChanged('contact');
                      }}
                      placeholder="Enter your email"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </Box>
                  <Box flex={1}>
                    <Text mb={2} fontWeight="semibold">Phone</Text>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => {
                        setPersonalInfo({...personalInfo, phone: e.target.value});
                        markSectionAsChanged('contact');
                      }}
                      placeholder="Enter your phone number"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </Box>
                </HStack>
                <Box>
                  <Text mb={2} fontWeight="semibold">Location</Text>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => {
                      setPersonalInfo({...personalInfo, location: e.target.value});
                      markSectionAsChanged('contact');
                    }}
                    placeholder="Enter your location"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </Box>
                <HStack gap={4}>
                  <Box flex={1}>
                    <Text mb={2} fontWeight="semibold">LinkedIn</Text>
                    <input
                      type="url"
                      value={personalInfo.linkedin}
                      onChange={(e) => {
                        setPersonalInfo({...personalInfo, linkedin: e.target.value});
                        markSectionAsChanged('contact');
                      }}
                      placeholder="https://linkedin.com/in/yourprofile"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </Box>
                  <Box flex={1}>
                    <Text mb={2} fontWeight="semibold">Website</Text>
                    <input
                      type="url"
                      value={personalInfo.website}
                      onChange={(e) => {
                        setPersonalInfo({...personalInfo, website: e.target.value});
                        markSectionAsChanged('contact');
                      }}
                      placeholder="https://yourwebsite.com"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </Box>
                </HStack>
              </VStack>
            </Box>
          )}

          {currentSection === 'job-description' && (
            <Box bg="white" p={6} borderRadius="md" shadow="sm">
              <HStack justify="space-between" mb={6}>
                <Heading size="md">Job Description</Heading>
                <Button
                  size="sm"
                  colorScheme="brand"
                  onClick={saveCurrentSection}
                  loading={isSaving}
                  disabled={!unsavedChanges.has('job-description')}
                >
                  <HStack gap={2}>
                    <FaSave />
                    <Text>Save Section</Text>
                  </HStack>
                </Button>
              </HStack>
              <VStack gap={4} alignItems="stretch">
                <Box>
                  <Text mb={2} fontWeight="semibold">
                    Paste the job description here
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={3}>
                    This helps our AI give you personalized suggestions for your resume sections
                  </Text>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      markSectionAsChanged('job-description');
                    }}
                    placeholder="Paste the complete job description here. Include requirements, responsibilities, and any specific skills mentioned..."
                    rows={12}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </Box>
                
                {jobDescription && (
                  <Box p={4} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                    <Text fontSize="sm" color="blue.700" fontWeight="semibold" mb={2}>
                      💡 AI Suggestions Available
                    </Text>
                    <Text fontSize="sm" color="blue.600">
                      Now when you fill out your Experience, Education, and Skills sections, 
                      our AI will provide suggestions based on this job description to help 
                      you match what employers are looking for!
                    </Text>
                  </Box>
                )}

                <Box p={4} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" color="gray.700" fontWeight="semibold" mb={2}>
                    📋 Tips for better AI suggestions:
                  </Text>
                  <VStack gap={2} align="start">
                    <Text fontSize="sm" color="gray.600">
                      • Include the complete job posting text
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      • Make sure to include required skills and qualifications
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      • Include any specific software or tools mentioned
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      • Don't worry about formatting - just paste the raw text
                    </Text>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          )}

          {currentSection === 'experience' && (
            <Box bg="white" p={6} borderRadius="md" shadow="sm">
              <HStack justify="space-between" mb={6}>
                <Heading size="md">Work Experience</Heading>
                <HStack gap={2}>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    colorScheme="brand"
                    leftIcon={<FaRobot />}
                    onClick={() => generateAISuggestions('experience')}
                    loading={isGeneratingSuggestions}
                  >
                    Get AI Suggestions
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="brand"
                    onClick={saveCurrentSection}
                    loading={isSaving}
                    disabled={!unsavedChanges.has('experience')}
                  >
                    <HStack gap={2}>
                      <FaSave />
                      <Text>Save Section</Text>
                    </HStack>
                  </Button>
                  <Button size="sm" colorScheme="brand" onClick={addExperience}>
                    Add Experience
                  </Button>
                </HStack>
              </HStack>

              {aiSuggestionsForSection && (
                <Box p={4} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200" mb={6}>
                  <Text fontSize="sm" color="blue.700" fontWeight="semibold" mb={2}>
                    💡 AI Suggestions for Experience Section:
                  </Text>
                  <Text fontSize="sm" color="blue.600" whiteSpace="pre-wrap">
                    {aiSuggestionsForSection}
                  </Text>
                </Box>
              )}

              {experiences.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500" mb={4}>No work experience added yet</Text>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Don't worry! Even if you haven't had a formal job, you can include:
                  </Text>
                  <VStack gap={2} align="start" mb={6}>
                    <Text fontSize="sm" color="gray.600">• Volunteer work</Text>
                    <Text fontSize="sm" color="gray.600">• School projects</Text>
                    <Text fontSize="sm" color="gray.600">• Internships or shadowing</Text>
                    <Text fontSize="sm" color="gray.600">• Part-time jobs or babysitting</Text>
                    <Text fontSize="sm" color="gray.600">• Leadership roles in clubs or sports</Text>
                  </VStack>
                  <Button colorScheme="brand" size="sm" onClick={addExperience}>
                    Add Your First Experience
                  </Button>
                </Box>
              ) : (
                <VStack gap={4} alignItems="stretch">
                  {experiences.map((exp) => (
                    <Box key={exp.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                      <HStack justify="space-between">
                        <Box flex={1}>
                          <Text fontWeight="semibold">{exp.position}</Text>
                          <Text color="gray.600">{exp.company}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </Text>
                          {exp.description && (
                            <Text fontSize="sm" color="gray.600" mt={2}>
                              {exp.description}
                            </Text>
                          )}
                        </Box>
                        <HStack gap={2}>
                          <Button size="xs" variant="outline" onClick={() => editExperience(exp)}>
                            Edit
                          </Button>
                          <Button size="xs" variant="outline" colorScheme="red" onClick={() => deleteExperience(exp.id)}>
                            Delete
                          </Button>
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          )}

          {/* Experience Form Modal */}
          {showAddExperienceForm && (
            <Box bg="white" p={6} borderRadius="md" shadow="sm" position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={1000} w="90%" maxW="600px" maxH="80vh" overflowY="auto">
              <Heading size="md" mb={4}>
                {editingExperience ? 'Edit Experience' : 'Add Experience'}
              </Heading>
              <ExperienceForm
                experience={editingExperience}
                onSave={saveExperience}
                onCancel={cancelExperienceForm}
              />
            </Box>
          )}

          {/* Overlay for modal */}
          {showAddExperienceForm && (
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              zIndex={999}
              onClick={cancelExperienceForm}
            />
          )}

          {/* Education Form Modal */}
          {showAddEducationForm && (
            <Box bg="white" p={6} borderRadius="md" shadow="sm" position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={1000} w="90%" maxW="600px" maxH="80vh" overflowY="auto">
              <Heading size="md" mb={4}>
                {editingEducation ? 'Edit Education' : 'Add Education'}
              </Heading>
              <EducationForm
                education={editingEducation}
                onSave={saveEducation}
                onCancel={cancelEducationForm}
              />
            </Box>
          )}

          {/* Overlay for education modal */}
          {showAddEducationForm && (
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              zIndex={999}
              onClick={cancelEducationForm}
            />
          )}

          {/* Skill Form Modal */}
          {showAddSkillForm && (
            <Box bg="white" p={6} borderRadius="md" shadow="sm" position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={1000} w="90%" maxW="500px" maxH="80vh" overflowY="auto">
              <Heading size="md" mb={4}>
                {editingSkill ? 'Edit Skill' : 'Add Skill'}
              </Heading>
              <SkillForm
                skill={editingSkill}
                onSave={saveSkill}
                onCancel={cancelSkillForm}
              />
            </Box>
          )}

          {/* Overlay for skill modal */}
          {showAddSkillForm && (
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              zIndex={999}
              onClick={cancelSkillForm}
            />
          )}

          {currentSection === 'education' && (
            <Box bg="white" p={6} borderRadius="md" shadow="sm">
              <HStack justify="space-between" mb={6}>
                <Heading size="md">Education</Heading>
                <HStack gap={2}>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    colorScheme="brand"
                    leftIcon={<FaRobot />}
                    onClick={() => generateAISuggestions('education')}
                    loading={isGeneratingSuggestions}
                  >
                    Get AI Suggestions
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="brand"
                    onClick={saveCurrentSection}
                    loading={isSaving}
                    disabled={!unsavedChanges.has('education')}
                  >
                    <HStack gap={2}>
                      <FaSave />
                      <Text>Save Section</Text>
                    </HStack>
                  </Button>
                  <Button size="sm" colorScheme="brand" onClick={addEducation}>
                    Add Education
                  </Button>
                </HStack>
              </HStack>

              {aiSuggestionsForSection && (
                <Box p={4} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200" mb={6}>
                  <Text fontSize="sm" color="blue.700" fontWeight="semibold" mb={2}>
                    💡 AI Suggestions for Education Section:
                  </Text>
                  <Text fontSize="sm" color="blue.600" whiteSpace="pre-wrap">
                    {aiSuggestionsForSection}
                  </Text>
                </Box>
              )}

              {education.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500" mb={4}>No education added yet</Text>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Include your current school, any relevant courses, or academic achievements:
                  </Text>
                  <VStack gap={2} align="start" mb={6}>
                    <Text fontSize="sm" color="gray.600">• High school or middle school</Text>
                    <Text fontSize="sm" color="gray.600">• Relevant coursework or projects</Text>
                    <Text fontSize="sm" color="gray.600">• Academic honors or awards</Text>
                    <Text fontSize="sm" color="gray.600">• GPA (if 3.0 or higher)</Text>
                    <Text fontSize="sm" color="gray.600">• Extracurricular activities</Text>
                  </VStack>
                  <Button colorScheme="brand" size="sm" onClick={addEducation}>
                    Add Your Education
                  </Button>
                </Box>
              ) : (
                <VStack gap={4} alignItems="stretch">
                  {education.map((edu) => (
                    <Box key={edu.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                      <HStack justify="space-between">
                        <Box flex={1}>
                          <Text fontWeight="semibold">{edu.degree}</Text>
                          <Text color="gray.600">{edu.institution}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {edu.startDate} - {edu.endDate}
                          </Text>
                          {edu.field && (
                            <Text fontSize="sm" color="gray.600" mt={1}>
                              {edu.field}
                            </Text>
                          )}
                          {edu.gpa && (
                            <Text fontSize="sm" color="gray.600" mt={1}>
                              GPA: {edu.gpa}
                            </Text>
                          )}
                        </Box>
                        <HStack gap={2}>
                          <Button size="xs" variant="outline" onClick={() => editEducation(edu)}>
                            Edit
                          </Button>
                          <Button size="xs" variant="outline" colorScheme="red" onClick={() => deleteEducation(edu.id)}>
                            Delete
                          </Button>
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          )}

          {currentSection === 'skills' && (
            <Box bg="white" p={6} borderRadius="md" shadow="sm">
              <HStack justify="space-between" mb={6}>
                <Heading size="md">Skills</Heading>
                <HStack gap={2}>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    colorScheme="brand"
                    leftIcon={<FaRobot />}
                    onClick={() => generateAISuggestions('skills')}
                    loading={isGeneratingSuggestions}
                  >
                    Get AI Suggestions
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="brand"
                    onClick={saveCurrentSection}
                    loading={isSaving}
                    disabled={!unsavedChanges.has('skills')}
                  >
                    <HStack gap={2}>
                      <FaSave />
                      <Text>Save Section</Text>
                    </HStack>
                  </Button>
                  <Button size="sm" colorScheme="brand" onClick={addSkill}>
                    Add Skill
                  </Button>
                </HStack>
              </HStack>

              {aiSuggestionsForSection && (
                <Box p={4} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200" mb={6}>
                  <Text fontSize="sm" color="blue.700" fontWeight="semibold" mb={2}>
                    💡 AI Suggestions for Skills Section:
                  </Text>
                  <Text fontSize="sm" color="blue.600" whiteSpace="pre-wrap">
                    {aiSuggestionsForSection}
                  </Text>
                </Box>
              )}

              {skills.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500" mb={4}>No skills added yet</Text>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Think about what you're good at! Include both technical and soft skills:
                  </Text>
                  <VStack gap={2} align="start" mb={6}>
                    <Text fontSize="sm" color="gray.600">• Computer skills (Microsoft Office, Google Docs)</Text>
                    <Text fontSize="sm" color="gray.600">• Programming languages (if any)</Text>
                    <Text fontSize="sm" color="gray.600">• Soft skills (leadership, teamwork, communication)</Text>
                    <Text fontSize="sm" color="gray.600">• Hobbies or interests that show skills</Text>
                    <Text fontSize="sm" color="gray.600">• Languages you speak</Text>
                  </VStack>
                  <Button colorScheme="brand" size="sm" onClick={addSkill}>
                    Add Your Skills
                  </Button>
                </Box>
              ) : (
                <VStack gap={4} alignItems="stretch">
                  {skills.map((skill) => (
                    <Box key={skill.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                      <HStack justify="space-between">
                        <Box flex={1}>
                          <Text fontWeight="semibold">{skill.name}</Text>
                          <Text color="gray.600">{skill.level}</Text>
                        </Box>
                        <HStack gap={2}>
                          <Button size="xs" variant="outline" onClick={() => editSkill(skill)}>
                            Edit
                          </Button>
                          <Button size="xs" variant="outline" colorScheme="red" onClick={() => deleteSkill(skill.id)}>
                            Delete
                          </Button>
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          )}

          {currentSection === 'summary' && (
            <Box bg="white" p={6} borderRadius="md" shadow="sm">
              <HStack justify="space-between" mb={6}>
                <Heading size="md">Professional Summary</Heading>
                <Button
                  size="sm"
                  colorScheme="brand"
                  onClick={saveCurrentSection}
                  loading={isSaving}
                  disabled={!unsavedChanges.has('summary')}
                >
                  <HStack gap={2}>
                    <FaSave />
                    <Text>Save Section</Text>
                  </HStack>
                </Button>
              </HStack>
              <textarea
                value={aiSuggestions}
                onChange={(e) => {
                  setAiSuggestions(e.target.value);
                  markSectionAsChanged('summary');
                }}
                placeholder="Write a compelling professional summary that highlights your key achievements and skills..."
                rows={8}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </Box>
          )}

          {currentSection === 'ats' && (
            <Box bg="white" p={6} borderRadius="md" shadow="sm">
              <HStack justify="space-between" mb={6}>
                <Heading size="md">ATS Scanner</Heading>
                <Button
                  size="sm"
                  colorScheme="brand"
                  onClick={saveCurrentSection}
                  loading={isSaving}
                  disabled={!unsavedChanges.has('ats')}
                >
                  <HStack gap={2}>
                    <FaSave />
                    <Text>Save Section</Text>
                  </HStack>
                </Button>
              </HStack>
              <ATSScanner
                personalInfo={personalInfo}
                experiences={experiences}
                education={education}
                skills={skills}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
              />
            </Box>
          )}

          {currentSection === 'preview' && (
            <Box bg="white" p={6} borderRadius="md" shadow="sm">
              <HStack justify="space-between" mb={6}>
                <Heading size="md">Resume Preview</Heading>
                <HStack gap={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentSection('contact')}
                  >
                    <HStack gap={2}>
                      <FaEdit />
                      <Text>Edit Resume</Text>
                    </HStack>
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="brand"
                    onClick={handleDownload}
                    loading={isSaving}
                  >
                    <HStack gap={2}>
                      <FaDownload />
                      <Text>Download PDF</Text>
                    </HStack>
                  </Button>
                </HStack>
              </HStack>
              
              {isLoadingPreview ? (
                <Box textAlign="center" py={8}>
                  <Text>Loading resume preview...</Text>
                </Box>
              ) : (
                <ResumePreview
                  personalInfo={personalInfo}
                  experiences={experiences}
                  education={education}
                  skills={skills}
                  aiSuggestions={aiSuggestions}
                  onEdit={() => setCurrentSection('contact')}
                  onDownload={handleDownload}
                />
              )}
            </Box>
          )}
        </Container>
      </SignedIn>
    </Box>
  );
} 