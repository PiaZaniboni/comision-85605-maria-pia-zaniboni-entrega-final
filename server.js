import "dotenv/config";
import mongoose from 'mongoose';
import app from './src/app.js';

const { MONGODB_URI, MONGO_DB = 'integrative_practice', PORT = 3000 } = process.env;

await mongoose.connect( MONGODB_URI, { dbName: MONGO_DB });
console.log(`Connected to MongoDB ${MONGO_DB}`);

const server = app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

process.on( 'SIGINT', async () => {
    console.log('\n👋 Bye Bye Bye');
    await mongoose.disconnect();
    server.close( () => process.exit(0));
});