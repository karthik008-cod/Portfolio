import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio-db';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// --- Schemas ---

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String, // Keep for backward compatibility
  images: [String], // Array of base64 or URLs
  link: String,
  order: Number,
  downloadLinks: [{ name: String, url: String }],
  installationGuide: String,
  releaseDate: String,
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);


const DetailSchema = new mongoose.Schema({
  key: { type: String, unique: true }, // e.g. "hero-title", "about-me"
  value: String,
}, { timestamps: true });

export const Detail = mongoose.models.Detail || mongoose.model('Detail', DetailSchema);


const SkillSchema = new mongoose.Schema({
  name: String,
  category: String,
  level: Number, // 1-100
}, { timestamps: true });

export const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);

const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  duration: String,
  description: String,
  order: Number,
}, { timestamps: true });

export const Education = mongoose.models.Education || mongoose.model('Education', EducationSchema);

const CertificationSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  date: String,
  link: String,
  image: String,
  order: Number,
}, { timestamps: true });

export const Certification = mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);
