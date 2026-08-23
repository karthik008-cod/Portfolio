import { connectToDatabase, Project, Skill, Detail, Education, Certification } from '@/lib/db';
import { AnimatedPortfolio } from '@/components/AnimatedPortfolio';

// Opt out of caching to always show the latest data from the admin panel
export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  await connectToDatabase();
  
  const projects = await Project.find().sort({ order: 1 }).lean();
  const skills = await Skill.find().lean();
  const details = await Detail.find().lean();
  const education = await Education.find().sort({ order: 1 }).lean();
  const certifications = await Certification.find().sort({ order: 1 }).lean();

  // Convert ObjectId and Date to string for client components
  const serialize = (doc: any) => ({
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString()
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
    </main>
  );
}
