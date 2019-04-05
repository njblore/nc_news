const { fetchTopics, addTopic } = require('../models/topics');

const sendTopics = (req, res, next) => {
  fetchTopics().then(topics => {
    res.status(200).send({ topics });
  });
};

const postTopic = (req, res, next) => {
  fetchTopics().then(topics => {
    if (topics.map(topic => topic.slug).includes(req.body.slug)) {
      res.status(422).send({ msg: 'Topic Already Exists' });
    } else {
      addTopic(req.body)
        .then(([topic]) => {
          res.status(201).send({ topic });
        })
        .catch(next);
    }
  });
};

module.exports = { sendTopics, postTopic };
