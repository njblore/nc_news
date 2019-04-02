const {
  fetchArticles,
  updateArticleById,
  deleteArticleById,
  fetchCommentsByArticleId,
} = require('../models/articles');

const sendArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(console.log);
};

const sendSingleArticle = (req, res, next) => {
  fetchArticles(req.params)
    .then(articles => {
      article = articles[0];
      res.status(200).send({ article });
    })
    .catch(console.log);
};

const sendUpdatedArticle = (req, res, next) => {
  updateArticleById(req).then(article => {
    article = article[0];
    res.status(200).send({ article });
  });
};

const removeArticleById = (req, res, next) => {
  deleteArticleById(req.params).then(() => {
    res.status(200).send({
      msg: `Article with id ${req.params.article_id} has been deleted.`,
    });
  });
};

const sendCommentsByArticleId = (req, res, next) => {
  const queriesAndParams = { ...req.query, ...req.params };
  fetchCommentsByArticleId(queriesAndParams).then(comments => {
    res.status(200).send({ comments });
  });
};

module.exports = {
  sendArticles,
  sendSingleArticle,
  sendUpdatedArticle,
  removeArticleById,
  sendCommentsByArticleId,
};
