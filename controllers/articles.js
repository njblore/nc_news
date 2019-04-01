const sendArticles = (req, res, next) => {
  res.status(200).send({ msg: 'ok' });
};

module.exports = { sendArticles };
