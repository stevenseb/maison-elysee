const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('MONGODB_URI from .env.local:', process.env.MONGODB_URI);

const mongoose = require('mongoose');
const Item = require('./models/Item'); // Adjust the path if necessary

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function updateItems() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await Item.updateMany(
      { quantity: { $exists: false } },
      { $set: { quantity: 1 } }
    );
    console.log('All items updated successfully.');
  } catch (error) {
    console.error('Error updating items:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateItems();
