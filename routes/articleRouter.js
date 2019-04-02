const articleRouter = require('express').Router();
const {
  sendArticles,
  sendSingleArticle,
  sendUpdatedArticle,
} = require('../controllers/articles');

articleRouter.route('/').get(sendArticles);

articleRouter
  .route('/:article_id')
  .get(sendSingleArticle)
  .patch(sendUpdatedArticle);

module.exports = articleRouter;
