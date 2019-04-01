const articleRouter = require('express').Router();
const { sendArticles } = require('../controllers/articles');

articleRouter.route('/').get(sendArticles);

module.exports = articleRouter;
