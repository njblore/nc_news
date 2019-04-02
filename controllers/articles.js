const {
  fetchArticles,
  updateArticleById,
  deleteArticleById,
  fetchCommentsByArticleId,
  postCommentByArticleId,
} = require('../models/articles');

const sendArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const sendSingleArticle = (req, res, next) => {
  if (isNaN(parseInt(req.params.article_id))) {
    next({ code: '42703' });
  }
  fetchArticles(req.params)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const sendUpdatedArticle = (req, res, next) => {
  updateArticleById(req)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const removeArticleById = (req, res, next) => {
  deleteArticleById(req.params)
    .then(() => {
      res.status(200).send({
        msg: `Article with id ${req.params.article_id} has been deleted.`,
      });
    })
    .catch(next);
};

const sendCommentsByArticleId = (req, res, next) => {
  const queriesAndParams = { ...req.query, ...req.params };
  fetchCommentsByArticleId(queriesAndParams)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const addCommentOnArticleId = (req, res, next) => {
  postCommentByArticleId(req)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

module.exports = {
  sendArticles,
  sendSingleArticle,
  sendUpdatedArticle,
  removeArticleById,
  sendCommentsByArticleId,
  addCommentOnArticleId,
};
