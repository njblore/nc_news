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
  if (
    req.query.order &&
    req.query.order !== 'asc' &&
    req.query.order !== 'desc'
  ) {
    next({ status: 400, msg: 'Invalid Order' });
  } else if (req.query.limit && !req.query.limit.match(/\d+/)) {
    next({ status: 400, msg: 'Invalid Limit' });
  } else {
    Promise.all([fetchTopics(), fetchArticles(req.query)])
      .then(([topics, { total_count, articles }]) => {
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
                res.status(200).send({ total_count, articles });
              }
            });
          } else {
            res.status(200).send({ total_count, articles });
          }
        }
      })
      .catch(next);
  }
};

const sendSingleArticle = (req, res, next) => {
  fetchArticles(req.params)
    .then(({ total_count, articles }) => {
      if (!articles | (articles.length === 0)) {
        next({ status: 404, msg: 'Article Not Found' });
      } else {
        article = articles[0];
        res.status(200).send({ total_count, article });
      }
    })
    .catch(next);
};

const sendUpdatedArticle = (req, res, next) => {
  if (!req.body.inc_votes) {
    req.body.inc_votes = 0;
  }
  updateArticleById(req)
    .then(([article]) => {
      if (!article) {
        next({ status: 404, msg: 'Article Not Found' });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};

const removeArticleById = (req, res, next) => {
  deleteArticleById(req.params)
    .then(numOfDeletions => {
      if (!numOfDeletions) {
        next({ status: 404, msg: 'Article Not Found' });
      } else {
        res.sendStatus(204);
      }
    })
    .catch(next);
};

const sendCommentsByArticleId = (req, res, next) => {
  const queriesAndParams = { ...req.query, ...req.params };

  if (
    req.query.order &&
    req.query.order !== 'asc' &&
    req.query.order !== 'desc'
  ) {
    next({ status: 400, msg: 'Bad Request' });
  } else if (req.query.limit && !req.query.limit.match(/\d+/)) {
    next({ status: 400, msg: 'Invalid Limit' });
  } else {
    Promise.all([
      fetchArticles({ article_id: req.params.article_id }),
      fetchCommentsByArticleId(queriesAndParams),
    ])
      .then(([{ total_count, articles }, comments]) => {
        if (articles.length === 0) {
          next({ status: 404, msg: 'Article Not Found' });
        } else {
          res.status(200).send({ comments });
        }
      })
      .catch(next);
  }
};

const addCommentOnArticleId = (req, res, next) => {
  if (
    !Object.keys(req.body).includes('body') |
    !Object.keys(req.body).includes('username')
  ) {
    next({ status: 400, msg: 'Bad Request' });
  }
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
