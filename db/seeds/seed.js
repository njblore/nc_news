const { articleData, commentsData, usersData, topicsData } = require('../data');

exports.seed = (connection, Promise) => {
  return connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => {
      return connection
        .insert(usersData)
        .into('users')
        .then(() => {
          return connection.insert(topicsData).into('topics');
        });
    });
};
