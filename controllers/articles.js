const {
  fetchArticles,
  updateArticleById,
  deleteArticleById,
  fetchCommentsByArticleId,
  postCommentByArticleId,
} = require('../models/articles');
const { fetchTopics } = require('../models/topics');
const { fetchUserById } = require('../models/users');

const sendArticles = (req, res, next) => {
  Promise.all([fetchTopics(), fetchArticles(req.query)])
    .then(([topics, articles]) => {
      if (
        req.query.topic &&
        !topics.map(topic => topic.slug).includes(req.query.topic)
      ) {
        next({ status: 404, msg: 'Topic Not Found' });
      } else {
        if (req.query.author) {
          fetchUserById({ username: req.query.author }).then(author => {
            if (author.length === 0) {
              next({ status: 404, msg: 'Author Not Found' });
            } else {
              res.status(200).send({ articles });
            }
          });
        } else {
          res.status(200).send({ articles });
        }
      }
    })
    .catch(next);
};

const sendSingleArticle = (req, res, next) => {
  fetchArticles(req.params)
    .then(([article]) => {
      if (!article) {
        next({ status: 404, msg: 'Article Not Found' });
      }
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
  Promise.all([
    fetchArticles(queriesAndParams),
    fetchCommentsByArticleId(queriesAndParams),
  ])
    .then(([article, comments]) => {
      console.log(comments);
      if (article.length === 0) {
        next({ status: 404, msg: 'Article Not Found' });
      } else {
        res.status(200).send({ comments });
      }
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
