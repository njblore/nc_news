const { fetchArticles } = require('../models/articles');

const sendArticles = (req, res, next) => {
  fetchArticles()
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(console.log);
};

module.exports = { sendArticles };
