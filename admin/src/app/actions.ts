'use server'

import { connectToDatabase, Project, Skill, Detail } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addProject(formData: FormData) {
  await connectToDatabase();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const link = formData.get('link') as string;
  const image = formData.get('image') as string; 
  const order = Number(formData.get('order')) || 0;

  await Project.create({ title, description, link, image, order });
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
