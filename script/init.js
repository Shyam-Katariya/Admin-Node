import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { hashPassword } from '../services/auth.service.js';

dotenv.config();

// MongoDB connection variables from the environment
const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;
const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME;

const admin = {
    name: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
};

(async () => {
    try {
        // Connect to the MongoDB server (without specifying a database)
        const client = new MongoClient(MONGO_CONNECTION_URL);
        await client.connect();
        console.log('Connected to MongoDB server');

        // Specify the target database
        const db = client.db(MONGO_DATABASE_NAME);
        console.log(`Using database: ${MONGO_DATABASE_NAME}`);
        
        // Check if the 'users' collection exists and create it if it doesn't
        const collections = await db.listCollections({ name: 'users' }).toArray();
        if (collections.length === 0) {
            await db.createCollection('users');
            console.log('Created "users" collection');
        }

        // Check if the admin user exists and create it if it doesn't
        const usersCollection = db.collection('users');
        const adminExists = await usersCollection.findOne({ email: admin.email });

        if (!adminExists) {
            console.log('Creating Admin User...');
            const hashedPassword = await hashPassword(admin.password);
            await usersCollection.insertOne({
                ...admin,
                password: hashedPassword,
                role: "admin",
            });
            console.log('Admin User Created!');
        } else {
            console.log('Admin User Already Exists!');
        }
        
        console.log('Initialization Complete!');
        await client.close();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
})();