// deno-lint-ignore-file
import { News, NewsModel } from '../models/news.ts';

const validateAndSanitizeData = (data: News) => {
	const errors = [];

	if (typeof data._id !== 'string' || !data._id.trim()) {
		errors.push("Invalid or missing '_id'");
	} else {
		data._id = data._id.trim();
	}

	if (typeof data.scope !== 'string' || !data.scope.trim()) {
		errors.push("Invalid or missing 'scope'");
	} else {
		data.scope = data.scope.trim();
	}

	if (typeof data.title !== 'string' || !data.title.trim()) {
		errors.push("Invalid or missing 'title'");
	} else {
		data.title = data.title.trim();
	}

	if (typeof data.resume !== 'string' || !data.resume.trim()) {
		errors.push("Invalid or missing 'resume'");
	} else {
		data.resume = data.resume.trim();
	}

	if (typeof data.source !== 'string' || !data.source.trim()) {
		errors.push("Invalid or missing 'source'");
	} else {
		data.source = data.source.trim();
	}

	if (
		!Array.isArray(data.media) ||
		!data.media.every((item: string) => typeof item === 'string')
	) {
		errors.push("Invalid 'media' format. Must be an array of strings.");
	}

	if (typeof data.img_description !== 'string') {
		errors.push("Invalid 'img_description'");
	} else {
		data.img_description = data.img_description.trim();
	}

	if (typeof data.text !== 'string' || !data.text.trim()) {
		errors.push("Invalid or missing 'text'");
	} else {
		data.text = data.text.trim();
	}

	if (
		!Array.isArray(data.tags) ||
		!data.tags.every((tag: string) => typeof tag === 'string')
	) {
		errors.push("Invalid 'tags' format. Must be an array of strings.");
	}

	if (typeof data.views !== 'number' || data.views < 0) {
		errors.push("Invalid 'views'. Must be a non-negative number.");
	}

	return { sanitizedData: data, errors };
};

export const createNews = async (context: any) => {
	try {
		const result = context.request.body({ type: 'json' });
		const body = await result.value;

		const { sanitizedData, errors } = validateAndSanitizeData(body);

		if (errors.length > 0) {
			context.response.status = 400;
			context.response.body = { message: 'Validation errors', errors };
			return;
		}

		const newNews = new NewsModel({
			...sanitizedData,
			date: Date.now(),
		});

		await newNews.save();

		context.response.status = 201;
		context.response.body = {
			message: 'News created successfully',
			news: newNews,
		};
	} catch (error: any) {
		context.response.status = 500;
		context.response.body = {
			message: 'Error creating the news',
			error: error.message,
		};
	}
};

export const getAllNews = async (context: any) => {
	try {
		const newsList: News[] = await NewsModel.find({});
		context.response.status = 200;
		context.response.body = newsList;
	} catch (error: any) {
		context.response.status = 500;
		context.response.body = {
			message: 'Error getting the news',
			error: error.message,
		};
	}
};

export const getNewsById = async (context: any) => {
	try {
		const { id } = context.params;
		const news = await NewsModel.findById(id);

		if (news) {
			context.response.status = 200;
			context.response.body = news;
		} else {
			context.response.status = 404;
			context.response.body = { message: 'News not found' };
		}
	} catch (error: any) {
		context.response.status = 500;
		context.response.body = {
			message: 'Error getting news',
			error: error.message,
		};
	}
};

export const updateNews = async (context: any) => {
	try {
		const newsId = context.params.id;

		const result = context.request.body({ type: 'json' });
		const body = await result.value;

		const updatedNews = await NewsModel.findByIdAndUpdate(newsId, body, {
			new: true,
		});

		if (!updatedNews) {
			context.response.status = 404;
			context.response.body = { message: 'News not found' };
			return;
		}

		context.response.status = 200;
		context.response.body = {
			message: 'News updated',
			news: updatedNews,
		};
	} catch (error: any) {
		console.error('Error to update the news:', error);
		context.response.status = 500;
		context.response.body = {
			message: 'Error to update the news',
			error: error.message,
		};
	}
};

export const deleteNews = async (context: any) => {
	try {
		const { id } = context.params;
		const deletedNews = await NewsModel.findByIdAndDelete(id);

		if (deletedNews) {
			context.response.status = 200;
			context.response.body = {
				message: 'News deleted successfully.',
				news: deletedNews,
			};
		} else {
			context.response.status = 404;
			context.response.body = { message: 'News not found.' };
		}
	} catch (error: any) {
		context.response.status = 500;
		context.response.body = {
			message: 'Error to delete the news.',
			error: error.message,
		};
	}
};
