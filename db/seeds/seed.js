const { articleData, commentsData, usersData, topicsData } = require('../data');
const {
  convertDate,
  createArticleRef,
  formatComments,
} = require('../../utils');

exports.seed = (connection, Promise) => {
  return connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => {
      return connection.insert(usersData).into('users');
    })
    .then(() => {
      return connection.insert(topicsData).into('topics');
    })
    .then(() => {
      let convertedArticleDate = convertDate(articleData);
      return connection
        .insert(convertedArticleDate)
        .into('articles')
        .returning('*');
    })
    .then(articleData => {
      let articlesRef = createArticleRef(articleData);
      let convertedCommentDate = convertDate(commentsData);
      let formattedComments = formatComments(convertedCommentDate, articlesRef);
      return connection.insert(formattedComments).into('comments');
    });
};
