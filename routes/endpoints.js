exports.endpoints = {
  '/api/topics': { GET: 'serves an array of all topics' },
  '/api/articles': { GET: 'serves an array of all articles' },
  '/api/articles/:article_id': {
    GET:
      'serves one article by its id, accepts queries for author, topic, sort_by and order',
    PATCH: 'update votes on article by article_id using inc_votes',
    DELETE: 'deletes article by its id',
  },
  '/api/articles/article_id/comments': {
    GET:
      'serves an array of all comments for one article by its id, accepts queries for sort_by, order',
    POST: 'post a comment to an article by the article_id',
  },
  '/api.articles/comments/:comment_id': {
    PATCH: 'update votes on a comment by comment_id using inc_votes',
    DELETE: 'delete one comment by its comment_id',
  },
  '/api/users/:username': { GET: 'serves one user by its username' },
};
