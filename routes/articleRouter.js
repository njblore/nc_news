const articleRouter = require('express').Router();
const { sendArticles, sendSingleArticle } = require('../controllers/articles');

articleRouter.route('/').get(sendArticles);

articleRouter.route('/:article_id').get(sendSingleArticle);

module.exports = articleRouter;
