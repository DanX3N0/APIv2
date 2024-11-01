import mongoose from 'npm:mongoose';

export interface News {
	_id: string;
	scope: string;
	title: string;
	resume: string;
	date: Date;
	source: string;
	media: string[];
	img_description: string;
	text: string;
	tags: string[];
	views: number;
}

const newsSchema = new mongoose.Schema<News>({
	_id: { type: String, required: true },
	scope: { type: String, required: true },
	title: { type: String, required: true },
	resume: { type: String, required: true },
	date: { type: Date, required: true },
	source: { type: String, required: true },
	media: { type: [String], default: [] },
	img_description: { type: String, required: false },
	text: { type: String, required: true },
	tags: { type: [String], default: [] },
	views: { type: Number, default: 0 },
});

export const NewsModel = mongoose.model<News>('News', newsSchema);
