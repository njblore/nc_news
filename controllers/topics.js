const { fetchTopics, addTopic } = require('../models/topics');

const sendTopics = (req, res, next) => {
  fetchTopics().then(topics => {
    res.status(200).send({ topics });
  });
};

const postTopic = (req, res, next) => {
  addTopic(req.body).then(([topic]) => {
    res.status(201).send({ topic });
  });
};

module.exports = { sendTopics, postTopic };
