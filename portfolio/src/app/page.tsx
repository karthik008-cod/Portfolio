import { connectToDatabase, Project, Skill, Detail, Education, Certification } from '@/lib/db';
import { AnimatedPortfolio } from '@/components/AnimatedPortfolio';
import { ContactSection } from '@/components/ContactSection';
import { mockProjects, mockSkills, mockDetails, mockEducation, mockCertifications } from '@/lib/mockData';

// Opt out of caching to always show the latest data from the admin panel
export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  let projects = [];
  let skills = [];
  let details = [];
  let education = [];
  let certifications = [];

  try {
    await connectToDatabase();
    
    projects = await Project.find().sort({ order: 1 }).lean();
    skills = await Skill.find().lean();
    details = await Detail.find().lean();
    education = await Education.find().sort({ order: 1 }).lean();
    certifications = await Certification.find().sort({ order: 1 }).lean();
  } catch (error) {
    console.warn("Database connection failed. Falling back to mock data.", error);
    projects = mockProjects as any;
    skills = mockSkills as any;
    details = mockDetails as any;
    education = mockEducation as any;
    certifications = mockCertifications as any;
  }

  // Convert ObjectId and Date to string for client components
  const serialize = (doc: any) => ({
    ...doc,
    _id: doc._id?.toString() || Math.random().toString(),
    createdAt: doc.createdAt?.toISOString ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString ? doc.updatedAt.toISOString() : new Date().toISOString()
  });

  return (
    <main className="min-h-screen">
      <AnimatedPortfolio 
        projects={projects.map(serialize)} 
        skills={skills.map(serialize)} 
        details={details.map(serialize)} 
        education={education.map(serialize)}
        certifications={certifications.map(serialize)}
      />
      <ContactSection />
    </main>
  );
}
