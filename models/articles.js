const connection = require('../db/connection');

const fetchArticles = query => {
  const { author, topic } = query;

  return connection
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .modify(articleQuery => {
      if (author) articleQuery.where({ author });
      if (topic) articleQuery.where({ topic });
    });
};

module.exports = { fetchArticles };
