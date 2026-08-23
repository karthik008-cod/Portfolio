'use server'

import { connectToDatabase, Project, Skill, Detail } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addProject(formData: FormData) {
  await connectToDatabase();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const link = formData.get('link') as string;
  const images = formData.getAll('images') as string[]; 
  const order = Number(formData.get('order')) || 0;
  const installationGuide = formData.get('installationGuide') as string;
  let downloadLinks = [];
  try { downloadLinks = JSON.parse(formData.get('downloadLinks') as string); } catch(e) {}

  await Project.create({ title, description, link, images, order, downloadLinks, installationGuide });
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
  const aboutMe = formData.get('about-me') as string;

  if (heroTitle !== null) await Detail.findOneAndUpdate({ key: 'hero-title' }, { value: heroTitle }, { upsert: true });
  if (heroSubtitle !== null) await Detail.findOneAndUpdate({ key: 'hero-subtitle' }, { value: heroSubtitle }, { upsert: true });
  if (heroIntro !== null) await Detail.findOneAndUpdate({ key: 'hero-intro' }, { value: heroIntro }, { upsert: true });
  if (email !== null) await Detail.findOneAndUpdate({ key: 'email' }, { value: email }, { upsert: true });
  if (aboutMe !== null) await Detail.findOneAndUpdate({ key: 'about-me' }, { value: aboutMe }, { upsert: true });

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
  let downloadLinks = [];
  try { downloadLinks = JSON.parse(formData.get('downloadLinks') as string); } catch(e) {}

  const updateData: any = { title, description, link, order, installationGuide, downloadLinks };
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
