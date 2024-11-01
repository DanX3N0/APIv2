import { config } from '../deps.ts';
import mongoose from 'npm:mongoose@latest';

config({ export: true });

const MONGO_URI = Deno.env.get('MONGO_URI') || 'http://localhost:27017';

export const connectDB = async () => {
	console.log(`Connnect to MongoDB...${MONGO_URI}`);
	try {
		await mongoose.connect(MONGO_URI);
	} catch (error) {
		console.error('Error to connect MONGODB:', error);
		throw error;
	}
};

connectDB().catch((error) => console.error(error));
