const articleRouter = require('express').Router();
const {
  sendArticles,
  sendSingleArticle,
  sendUpdatedArticle,
  removeArticleById,
  sendCommentsByArticleId,
  addCommentOnArticleId,
} = require('../controllers/articles');

articleRouter.route('/').get(sendArticles);

articleRouter
  .route('/:article_id')
  .get(sendSingleArticle)
  .patch(sendUpdatedArticle)
  .delete(removeArticleById);

articleRouter
  .route('/:article_id/comments')
  .get(sendCommentsByArticleId)
  .post(addCommentOnArticleId);

module.exports = articleRouter;
