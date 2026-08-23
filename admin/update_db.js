const mongoose = require('mongoose');

async function run() {
  const uri = "mongodb+srv://yuvaankaarthikeyaa1206_db_user:nSmAl1oyUfSxH0nL@cluster0.m1384rx.mongodb.net/portfolio?retryWrites=true&w=majority";
  
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
