const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const articleRouter = require('./articleRouter');
const { methodNotAllowed } = require('../errors');

apiRouter.route('/').get((req, res) => res.send({ ok: true }));

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articleRouter);

module.exports = apiRouter;
