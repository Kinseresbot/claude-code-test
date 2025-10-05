const mongoose = require('mongoose');

let isConnected = false;

async function connectDatabase() {
  if (isConnected) {
    return;
  }

  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sample_app';

  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
  console.log('Database connected');
}

module.exports = { connectDatabase };
