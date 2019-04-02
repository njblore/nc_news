const connection = require('../db/connection');

const fetchArticles = query => {
  const { author, topic, sort_by, order, article_id } = query;

  return connection
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .modify(articleQuery => {
      if (author) articleQuery.where({ author });
      if (topic) articleQuery.where({ topic });
      if (article_id)
        articleQuery.where('articles.article_id', '=', article_id);
    });
};

module.exports = { fetchArticles };
