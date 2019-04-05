const articleRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const {
  sendArticles,
  sendSingleArticle,
  sendUpdatedArticle,
  removeArticleById,
  sendCommentsByArticleId,
  addCommentOnArticleId,
  addArticle,
} = require('../controllers/articles');

articleRouter
  .route('/')
  .get(sendArticles)
  .post(addArticle)
  .all(methodNotAllowed);

articleRouter
  .route('/:article_id')
  .get(sendSingleArticle)
  .patch(sendUpdatedArticle)
  .delete(removeArticleById)
  .all(methodNotAllowed);

articleRouter
  .route('/:article_id/comments')
  .get(sendCommentsByArticleId)
  .post(addCommentOnArticleId)
  .all(methodNotAllowed);

module.exports = articleRouter;
