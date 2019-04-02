const connection = require('../db/connection');

const fetchArticles = () => {
  return connection
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id');
};

module.exports = { fetchArticles };
