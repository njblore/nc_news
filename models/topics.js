const connection = require('../db/connection');

const fetchTopics = () => {
  return connection.select('*').from('topics');
};

const addTopic = req => {
  return connection
    .insert(req)
    .into('topics')
    .returning('*');
};

module.exports = { fetchTopics, addTopic };
