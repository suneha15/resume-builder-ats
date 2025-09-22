# Speakhire Resume Builder - AI-Powered Resume Builder for Students - updated

A modern Next.js application specifically designed for students aged 12-16 to create their first professional resumes with AI guidance, job description matching, and ATS (Applicant Tracking System) optimization. Features intelligent suggestions and persistent database storage.

## 🚀 Current Features

### Core Functionality
- 🎓 **Student-Focused Design** - Specifically designed for students aged 12-16
- 🤖 **AI Guidance & Suggestions** - Get personalized recommendations using Google's Gemini AI
- 🎯 **Job Description Matching** - AI helps match your resume to specific job requirements
- 📊 **Smart ATS Scanner** - Analyze resume compatibility and get improvement tips
- ✨ **Easy-to-Use Interface** - Intuitive form-based builder perfect for first-time users
- 🔐 **Secure Authentication** - Safe user management with Clerk
- 💾 **Persistent Storage** - Save and edit your resumes with Neon database
- 📄 **PDF Export** - Download professional PDF resumes
- 📱 **Mobile-Friendly** - Works perfectly on all devices
- 👤 **User Isolation** - Each user has their own private resumes

### Advanced Features
- 🔄 **Section-Based Saving** - Save individual sections with visual indicators
- 👁️ **Resume Preview** - Preview saved resumes in read-only mode
- ✏️ **Edit & Update** - Edit existing resumes with full CRUD functionality
- 🗑️ **Delete Management** - Remove resumes with confirmation
- 💾 **Hybrid Storage** - localStorage backup + database persistence
- 🎨 **Modern UI** - Beautiful Chakra UI v3 components with animations
- 📊 **Real-time Feedback** - Visual indicators for unsaved changes and AI suggestions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Chakra UI v3
- **Authentication**: Clerk (Next.js SDK)
- **Database**: Neon (PostgreSQL)
- **ORM**: Prisma
- **AI Integration**: Google Gemini API (gemini-1.5-flash)
- **Styling**: Chakra UI v3, Emotion
- **PDF Generation**: jsPDF (text-based)
- **State Management**: React Hooks (useState, useEffect)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account for authentication
- Google AI Studio account for Gemini API
- Neon account for database storage

### Installation

1. Clone the repository:
```bash
git clone https://github.com/suneha15/resume-builder-ats.git
cd resume-builder-ats
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Gemini AI API
GEMINI_API_KEY=your_gemini_api_key_here

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

5. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Application Flow

### 1. Authentication Flow
```
User visits app → Clerk authentication → Dashboard (if logged in) → Landing page (if not logged in)
```

### 2. Resume Creation Flow
```
Dashboard → Create New Resume → Fill sections → Save Section → Preview → Download PDF
```

### 3. Data Persistence Flow
```
User input → localStorage (immediate) → Database (on save) → Dashboard display
```

### 4. AI Enhancement Flow
```
Upload job description → AI analyzes → Generate suggestions → Apply to resume sections
```

### 5. Preview Flow
```
Dashboard → Click Preview → Load resume data → Display in read-only mode → Edit/Download options
```

## 🎯 Usage Guide

### Dashboard Features
- **View All Resumes** - See all your saved resumes with titles and dates
- **Create New Resume** - Start building a new resume from scratch
- **Edit Resume** - Modify existing resumes
- **Preview Resume** - View resume in read-only mode
- **Download PDF** - Generate and download resume as PDF
- **Delete Resume** - Remove resumes with confirmation

### Resume Builder Features
- **Section Navigation** - Horizontal navigation between sections
- **Personal Information** - Name, contact details, location
- **Job Description** - Upload job description for AI matching
- **Experience** - Add, edit, delete work experiences with AI suggestions
- **Education** - Add, edit, delete education with AI suggestions
- **Skills** - Add, edit, delete skills with AI suggestions
- **AI Suggestions** - Get personalized recommendations based on job description
- **ATS Scanner** - Analyze resume compatibility
- **Preview** - See final resume before downloading

### AI Features
- **Smart Suggestions** - AI-powered recommendations for each section
- **Job Matching** - Match resume content to job requirements
- **ATS Optimization** - Improve ATS compatibility scores
- **Content Enhancement** - Better descriptions and bullet points

## 🗄️ Database Schema

### Users Table
```sql
- id: String (Primary Key)
- clerkUserId: String (Unique, Clerk ID)
- email: String
- createdAt: DateTime
- updatedAt: DateTime
```

### Resumes Table
```sql
- id: String (Primary Key)
- userId: String (Foreign Key)
- title: String
- personalInfo: Json
- experiences: Json[]
- education: Json[]
- skills: Json[]
- summary: String
- jobDescription: String
- aiSuggestions: String
- atsScore: Int?
- createdAt: DateTime
- updatedAt: DateTime
```

### Job Descriptions Table
```sql
- id: String (Primary Key)
- userId: String (Foreign Key)
- resumeId: String (Foreign Key)
- jobTitle: String
- company: String
- description: String
- atsResult: Json
- createdAt: DateTime
```

## 🔌 API Endpoints

### Resume Management
- `GET /api/resumes` - Get all user's resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/[id]` - Get specific resume
- `PUT /api/resumes/[id]` - Update resume
- `DELETE /api/resumes/[id]` - Delete resume

### AI & ATS Features
- `POST /api/ai-enhance` - Get AI suggestions for resume improvement
- `POST /api/ats-scan` - Analyze resume compatibility with job descriptions
- `POST /api/job-descriptions` - Save job description and ATS results
- `GET /api/job-descriptions` - Get user's job description history

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── ai-enhance/         # AI enhancement endpoint
│   │   ├── ats-scan/           # ATS scanning endpoint
│   │   ├── resumes/            # Resume CRUD endpoints
│   │   └── job-descriptions/   # Job description endpoints
│   ├── dashboard/              # Dashboard page
│   ├── resume-builder/         # Resume builder page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── ATSScanner.tsx          # ATS scanning component
│   └── ResumePreview.tsx       # Resume preview component
├── lib/
│   └── prisma.ts               # Prisma client configuration
├── prisma/
│   └── schema.prisma           # Database schema
└── middleware.ts               # Clerk authentication middleware
```

## 🎨 UI Components

### Chakra UI v3 Components Used
- **Layout**: Box, Container, HStack, VStack, Stack
- **Typography**: Heading, Text
- **Forms**: Input, Textarea, Button, IconButton
- **Navigation**: Tabs, TabList, TabPanels, TabPanel
- **Feedback**: Alert, Badge, Progress
- **Overlay**: Modal, ModalOverlay, ModalContent
- **Data Display**: Card, Divider

### Custom Components
- **ATSScanner** - ATS compatibility analysis
- **ResumePreview** - Resume display and formatting
- **Form Modals** - Experience, Education, Skills forms

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio

### Database Management
```bash
# View database in browser
npx prisma studio

# Reset database (careful!)
npx prisma db push --force-reset

# Generate new migration
npx prisma migrate dev --name migration_name
```

## 🚀 Deployment

### Environment Setup
1. Set up Neon database
2. Configure Clerk authentication
3. Get Gemini API key
4. Set environment variables
5. Deploy to Vercel/Netlify

### Production Checklist
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Clerk authentication working
- [ ] AI API keys valid
- [ ] PDF generation tested
- [ ] All features working

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@speakhire.com or create an issue in the [GitHub repository](https://github.com/suneha15/resume-builder-ats).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Chakra UI](https://chakra-ui.com/) for the beautiful component library
- [Clerk](https://clerk.com/) for authentication
- [Neon](https://neon.tech/) for database hosting
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Prisma](https://prisma.io/) for database ORM

---

**Built with ❤️ for students by the Speakhire team**