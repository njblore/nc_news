const { fetchArticles, updateArticleById } = require('../models/articles');

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

module.exports = { sendArticles, sendSingleArticle, sendUpdatedArticle };
