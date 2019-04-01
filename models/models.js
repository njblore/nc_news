const connection = require('../db/connection');

const fetchTopics = () => {
  return connection.select('*').from('topics');
};

module.exports = { fetchTopics };
