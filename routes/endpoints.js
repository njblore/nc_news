exports.endpoints = {
  '/api/topics': {
    GET: 'serves an array of all topics',
    POST: 'post a new topic to the database',
  },
  '/api/articles': {
    GET:
      'serves an array of all articles, accepts queries for author, topic, sort_by, order, article_id, limit',
    POST: 'post a new article to the database',
  },
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
  '/api/comments/:comment_id': {
    PATCH: 'update votes on a comment by comment_id using inc_votes',
    DELETE: 'delete one comment by its comment_id',
  },
  'api/users': {
    GET: 'serves an array of all users in the database',
    POST: 'add a new user to the database',
  },
  '/api/users/:username': {
    GET: 'serves one user by its username',
    PATCH: "update a user's avatar_url and/or name",
  },
};
