require('dotenv').config({ path: './atlas-credentials.env' });
const mongoose = require('mongoose');

async function run() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://admin:admin@portfolio.hsq31.mongodb.net/?retryWrites=true&w=majority&appName=Portfolio";
  
  await mongoose.connect(uri);
  
  const detailSchema = new mongoose.Schema({
    key: String,
    value: String,
  });
  
  const Detail = mongoose.models.Detail || mongoose.model('Detail', detailSchema);
  
  const res = await Detail.findOneAndUpdate(
    { key: 'hero-title' },
    { value: 'Yuvaa Kaarthikeyaa' },
    { new: true }
  );
  
  console.log("Updated DB:", res);
  process.exit(0);
}

run();
