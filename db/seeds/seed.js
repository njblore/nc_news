const { articleData, commentsData, usersData, topicsData } = require('../data');
const { convertDate } = require('../../utils');

exports.seed = (connection, Promise) => {
  return connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => {
      return connection
        .insert(usersData)
        .into('users')
        .then(() => {
          return connection
            .insert(topicsData)
            .into('topics')
            .then(() => {
              let convertedArticleDate = convertDate(articleData);
              return connection
                .insert(convertedArticleDate)
                .into('articles')
                .then(() => {
                  let convertedCommentDate = convertDate(commentsData);
                  return connection
                    .insert(convertedCommentDate)
                    .into('comments');
                });
            });
        });
    });
};
