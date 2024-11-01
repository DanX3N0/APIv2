import { Router } from '../deps.ts';
import {
	createNews,
	deleteNews,
	getAllNews,
	getNewsById,
	updateNews,
} from '../controllers/newsController.ts';

const router = new Router();

router
	.get('/v2/news', getAllNews)
	.get('/v2/news/:id', getNewsById)
	.post('/v2/news', createNews)
	.put('/v2/news/:id', updateNews)
	.delete('/v2/news/:id', deleteNews);

export default router;
