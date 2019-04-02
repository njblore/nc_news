const { fetchArticles } = require('../models/articles');

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

module.exports = { sendArticles, sendSingleArticle };
