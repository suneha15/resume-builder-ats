'use client';

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  HStack,
  Icon,
  SimpleGrid,
  Stack
} from '@chakra-ui/react';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { FaFileAlt, FaRobot, FaSearch, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {

  const features = [
    {
      icon: FaFileAlt,
      title: 'Student-Friendly Builder',
      description: 'Easy-to-use form designed specifically for young students to create their first resume'
    },
    {
      icon: FaRobot,
      title: 'AI Guidance & Suggestions',
      description: 'Get personalized AI recommendations based on job descriptions to improve your resume'
    },
    {
      icon: FaSearch,
      title: 'Smart ATS Scanner',
      description: 'Check how well your resume matches job requirements and get improvement tips'
    },
    {
      icon: FaDownload,
      title: 'Professional PDF Export',
      description: 'Download your polished resume as a professional PDF ready for applications'
    }
  ];

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Box bg="brand.500" color="white" py={4}>
        <Container maxW="container.xl">
          <HStack justifyContent="space-between">
            <Heading size="lg">Speakhire Resume Builder</Heading>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <HStack gap={4}>
                <SignInButton mode="modal">
                  <Button variant="outline" colorScheme="whiteAlpha">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button colorScheme="whiteAlpha">
                    Sign Up
                  </Button>
                </SignUpButton>
              </HStack>
            </SignedOut>
          </HStack>
        </Container>
      </Box>

      {/* Hero Section - Centered */}
      <Box flex="1" display="flex" alignItems="center" justifyContent="center" py={20}>
        <Container maxW="container.xl">
          <Stack gap={8} textAlign="center" alignItems="center">
            <Box
              opacity={0}
              transform="translateY(40px)"
              animation="fadeInUp 1s ease-out 0.2s forwards"
              css={{
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(40px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            >
              <Heading 
                size="2xl" 
                color="brand.500" 
                maxW="4xl"
                _hover={{
                  transform: 'scale(1.02)',
                  transition: 'transform 0.3s ease'
                }}
                transition="transform 0.3s ease"
              >
                Build Your First Resume with AI Guidance
              </Heading>
            </Box>
            <Box
              opacity={0}
              transform="translateY(30px)"
              animation="fadeInUp 1s ease-out 0.4s forwards"
              css={{
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(30px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            >
              <Text fontSize="xl" color="gray.600" maxW="2xl">
                Perfect for students aged 12-16! Get AI-powered guidance to create your first professional resume. 

              </Text>
            </Box>
            <Box
              opacity={0}
              transform="translateY(20px)"
              animation="fadeInUp 1s ease-out 0.6s forwards"
              css={{
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            >
              <Stack gap={4}>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button 
                      size="lg" 
                      colorScheme="brand"
                      _hover={{
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      Go to Dashboard
                    </Button>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <HStack gap={4} justifyContent="center" flexWrap="wrap">
                    <SignUpButton mode="modal">
                      <Button 
                        size="lg" 
                        colorScheme="brand"
                        _hover={{
                          transform: 'translateY(-2px) scale(1.05)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        Start Building My Resume
                      </Button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <Button 
                        size="lg" 
                        variant="outline"
                        _hover={{
                          transform: 'translateY(-2px) scale(1.05)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                  </HStack>
                </SignedOut>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Student Focus Section */}
      <Box bg="brand.50" py={16}>
        <Container maxW="container.xl">
          <Stack gap={8} textAlign="center" alignItems="center">
            <Box
              opacity={0}
              transform="translateY(30px)"
              animation="fadeInUp 0.8s ease-out 0.2s forwards"
              css={{
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(30px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            >
              <Heading size="xl" color="brand.600" maxW="4xl">
                Designed Specifically for Young Students
              </Heading>
              <Text fontSize="lg" color="brand.700" maxW="3xl" mt={4}>
                No experience needed! Our AI guides you through every step, from basic information 
                to professional bullet points that match any job description.
              </Text>
            </Box>
            <Box
              opacity={0}
              transform="translateY(20px)"
              animation="fadeInUp 0.8s ease-out 0.4s forwards"
              css={{
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            >
              <Text fontSize="md" color="brand.600" maxW="2xl">
                ✨ Perfect for ages 12-16 • 🎯 AI-powered job matching • 📊 ATS score feedback • 🚀 Land your first opportunity
              </Text>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Features Section - Centered */}
      <Box bg="gray.50" py={20}>
        <Container maxW="container.xl">
          <Stack gap={12} textAlign="center" alignItems="center">
            <Box
              opacity={0}
              transform="translateY(30px)"
              animation="fadeInUp 0.8s ease-out forwards"
              css={{
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(30px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            >
              <Heading size="xl" maxW="3xl">
                Everything Young Students Need for Their First Resume
              </Heading>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8} w="full" maxW="6xl">
              {features.map((feature, index) => (
                <Box 
                  key={index} 
                  bg="white" 
                  shadow="md" 
                  p={6} 
                  borderRadius="md" 
                  textAlign="center"
                  opacity={0}
                  transform="translateY(50px)"
                  animation={`fadeInUp 0.6s ease-out ${index * 0.1 + 0.3}s forwards`}
                  _hover={{
                    transform: 'translateY(-8px) scale(1.02)',
                    shadow: 'xl',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    _before: {
                      left: '100%'
                    }
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  cursor="pointer"
                  position="relative"
                  overflow="hidden"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    transition: 'left 0.5s'
                  }}
css={{
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(50px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
                >
                  <Box 
                    mb={4}
                    _hover={{
                      transform: 'scale(1.1) rotate(5deg)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    <Icon 
                      as={feature.icon} 
                      boxSize={12} 
                      color="brand.500"
                      _hover={{
                        color: 'brand.600',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                      }}
                      transition="all 0.3s ease"
                    />
                  </Box>
                  <Heading 
                    size="md" 
                    mb={2}
                    _hover={{
                      color: 'brand.600',
                      transition: 'color 0.3s ease'
                    }}
                    transition="color 0.3s ease"
                  >
                    {feature.title}
                  </Heading>
                  <Text 
                    color="gray.600"
                    _hover={{
                      color: 'gray.700',
                      transition: 'color 0.3s ease'
                    }}
                    transition="color 0.3s ease"
                  >
                    {feature.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section - Centered */}
      <Box bg="brand.500" color="white" py={20}>
        <Container maxW="container.xl">
          <Stack gap={6} textAlign="center" alignItems="center">
            <Box
              opacity={0}
              transform="translateY(30px)"
              animation="fadeInUp 0.8s ease-out 0.2s forwards"
              css={{
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(30px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            >
              <Heading 
                size="xl" 
                maxW="3xl"
                _hover={{
                  transform: 'scale(1.02)',
                  transition: 'transform 0.3s ease'
                }}
                transition="transform 0.3s ease"
              >
                Ready to Create Your First Professional Resume?
              </Heading>
            </Box>
            <Box
              opacity={0}
              transform="translateY(20px)"
              animation="fadeInUp 0.8s ease-out 0.4s forwards"
              css={{
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            >
              <Text fontSize="lg" maxW="2xl">
                Join hundreds of students who have successfully created their first resumes 
                and landed amazing opportunities with our AI-powered guidance.
              </Text>
            </Box>
            <Box
              opacity={0}
              transform="translateY(20px)"
              animation="fadeInUp 0.8s ease-out 0.6s forwards"
              css={{
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            >
              <SignedOut>
                <SignUpButton mode="modal">
                    <Button 
                      size="lg" 
                      colorScheme="whiteAlpha"
                      _hover={{
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      Create My First Resume
                    </Button>
                </SignUpButton>
              </SignedOut>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}