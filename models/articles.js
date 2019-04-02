const connection = require('../db/connection');

const fetchArticles = () => {
  return connection
    .select('*')
    .from('articles')
    .leftJoin('comments', 'comments.belongs_to', 'articles.title')
    .count({ comment_count: 'comment_id' });
};

module.exports = { fetchArticles };
