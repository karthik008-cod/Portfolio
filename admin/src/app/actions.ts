'use server'

import { connectToDatabase, Project, Skill, Detail, Education, Certification } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addProject(formData: FormData) {
  await connectToDatabase();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const link = formData.get('link') as string;
  const images = formData.getAll('images') as string[]; 
  const order = Number(formData.get('order')) || 0;
  const installationGuide = formData.get('installationGuide') as string;
  const releaseDate = formData.get('releaseDate') as string;
  let downloadLinks = [];
  try { downloadLinks = JSON.parse(formData.get('downloadLinks') as string); } catch(e) {}

  await Project.create({ title, description, link, images, order, downloadLinks, installationGuide, releaseDate });
  revalidatePath('/');
}

export async function deleteProject(id: string) {
  await connectToDatabase();
  await Project.findByIdAndDelete(id);
  revalidatePath('/');
}

export async function addSkill(formData: FormData) {
  await connectToDatabase();
  
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const level = Number(formData.get('level')) || 50;

  await Skill.create({ name, category, level });
  revalidatePath('/');
}

export async function deleteSkill(id: string) {
  await connectToDatabase();
  await Skill.findByIdAndDelete(id);
  revalidatePath('/');
}

export async function updateDetail(formData: FormData) {
  await connectToDatabase();
  
  const key = formData.get('key') as string;
  const value = formData.get('value') as string;

  await Detail.findOneAndUpdate({ key }, { value }, { upsert: true });
  revalidatePath('/');
}

export async function updateAllDetails(formData: FormData) {
  await connectToDatabase();
  
  const heroTitle = formData.get('hero-title') as string;
  const heroSubtitle = formData.get('hero-subtitle') as string;
  const heroIntro = formData.get('hero-intro') as string;
  const email = formData.get('email') as string;
  const experienceStartYear = formData.get('experience-start-year') as string;
  const aboutMe = formData.get('about-me') as string;
  const linkedinUrl = formData.get('linkedin-url') as string;
  const githubUrl = formData.get('github-url') as string;
  const leetcodeUrl = formData.get('leetcode-url') as string;

  if (heroTitle !== null) await Detail.findOneAndUpdate({ key: 'hero-title' }, { value: heroTitle }, { upsert: true });
  if (heroSubtitle !== null) await Detail.findOneAndUpdate({ key: 'hero-subtitle' }, { value: heroSubtitle }, { upsert: true });
  if (heroIntro !== null) await Detail.findOneAndUpdate({ key: 'hero-intro' }, { value: heroIntro }, { upsert: true });
  if (email !== null) await Detail.findOneAndUpdate({ key: 'email' }, { value: email }, { upsert: true });
  if (experienceStartYear !== null) await Detail.findOneAndUpdate({ key: 'experience-start-year' }, { value: experienceStartYear }, { upsert: true });
  if (aboutMe !== null) await Detail.findOneAndUpdate({ key: 'about-me' }, { value: aboutMe }, { upsert: true });
  if (linkedinUrl !== null) await Detail.findOneAndUpdate({ key: 'linkedin-url' }, { value: linkedinUrl }, { upsert: true });
  if (githubUrl !== null) await Detail.findOneAndUpdate({ key: 'github-url' }, { value: githubUrl }, { upsert: true });
  if (leetcodeUrl !== null) await Detail.findOneAndUpdate({ key: 'leetcode-url' }, { value: leetcodeUrl }, { upsert: true });

  revalidatePath('/');
}

export async function updateProject(formData: FormData) {
  await connectToDatabase();
  
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const link = formData.get('link') as string;
  const images = formData.getAll('images') as string[]; 
  const order = Number(formData.get('order')) || 0;
  const installationGuide = formData.get('installationGuide') as string;
  const releaseDate = formData.get('releaseDate') as string;
  let downloadLinks = [];
  try { downloadLinks = JSON.parse(formData.get('downloadLinks') as string); } catch(e) {}

  const updateData: any = { title, description, link, order, installationGuide, downloadLinks, releaseDate };
  if (images && images.length > 0) {
    updateData.images = images;
  } else {
    // Allow saving empty array if all images are deleted
    updateData.images = [];
  }

  await Project.findByIdAndUpdate(id, updateData);
  revalidatePath('/');
}

export async function updateSkill(formData: FormData) {
  await connectToDatabase();
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const level = Number(formData.get('level')) || 50;

  await Skill.findByIdAndUpdate(id, { name, category, level });
  revalidatePath('/');
}

// --- Education Actions ---

export async function addEducation(formData: FormData) {
  await connectToDatabase();
  
  const degree = formData.get('degree') as string;
  const institution = formData.get('institution') as string;
  const duration = formData.get('duration') as string;
  const description = formData.get('description') as string;
  const order = Number(formData.get('order')) || 0;

  await Education.create({ degree, institution, duration, description, order });
  revalidatePath('/');
}

export async function updateEducation(formData: FormData) {
  await connectToDatabase();
  
  const id = formData.get('id') as string;
  const degree = formData.get('degree') as string;
  const institution = formData.get('institution') as string;
  const duration = formData.get('duration') as string;
  const description = formData.get('description') as string;
  const order = Number(formData.get('order')) || 0;

  await Education.findByIdAndUpdate(id, { degree, institution, duration, description, order });
  revalidatePath('/');
}

export async function deleteEducation(id: string) {
  await connectToDatabase();
  await Education.findByIdAndDelete(id);
  revalidatePath('/');
}

// --- Certification Actions ---

export async function addCertification(formData: FormData) {
  await connectToDatabase();
  
  const name = formData.get('name') as string;
  const issuer = formData.get('issuer') as string;
  const date = formData.get('date') as string;
  const link = formData.get('link') as string;
  const image = formData.get('image') as string;
  const order = Number(formData.get('order')) || 0;

  await Certification.create({ name, issuer, date, link, image, order });
  revalidatePath('/');
}

export async function updateCertification(formData: FormData) {
  await connectToDatabase();
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const issuer = formData.get('issuer') as string;
  const date = formData.get('date') as string;
  const link = formData.get('link') as string;
  const image = formData.get('image') as string;
  const order = Number(formData.get('order')) || 0;

  const updateData: any = { name, issuer, date, link, order };
  if (image) {
    updateData.image = image;
  } else if (image === '') { // if explicitly cleared
    updateData.image = '';
  }

  await Certification.findByIdAndUpdate(id, updateData);
  revalidatePath('/');
}

export async function deleteCertification(id: string) {
  await connectToDatabase();
  await Certification.findByIdAndDelete(id);
  revalidatePath('/');
}
