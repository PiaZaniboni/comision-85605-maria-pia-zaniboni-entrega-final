import "dotenv/config";
import mongoose from 'mongoose';
import app from './src/app.js';
//import { EmailService } from './src/services/email.service.js'; //testing email service

const { MONGODB_URI, MONGO_DB = 'integrative_practice', PORT = 3000 } = process.env;

await mongoose.connect( MONGODB_URI, { dbName: MONGO_DB });
console.log(`Connected to MongoDB ${MONGO_DB}`);

//VERIFICAR EMAIL AL INICIAR (TEMPORAL)
//const emailService = new EmailService();
//await emailService.verifyConnection();

const server = app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

process.on( 'SIGINT', async () => {
    console.log('\n👋 Bye Bye Bye');
    await mongoose.disconnect();
    server.close( () => process.exit(0));
});