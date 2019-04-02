process.env.NODE_ENV = 'test';
const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-sorted'));
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');
const request = supertest(app);

describe('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe('/api', () => {
    it('GET status:200', () => {
      return request
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    describe('/api/topics', () => {
      it('GET status:200 serves an array of topic objects', () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(res => {
            expect(res.body.topics).to.be.an('array');
            expect(res.body.topics[0]).to.contain.keys('slug', 'description');
          });
      });
    });
    describe('/api/articles', () => {
      it('GET status: 200 serves an array of article objects', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.an('array');
            expect(res.body.articles[0]).to.contain.keys(
              'author',
              'title',
              'article_id',
              'topic',
              'created_at',
              'votes',
            );
          });
      });
      it('GET status: 200 adds a comment count key for each article object', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(res => {
            expect(res.body.articles[0]).to.contain.keys('comment_count');
          });
      });
      it('GET status: 200 and accepts query for author', () => {
        return request
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(res => {
            console.log(res.body.articles);
            expect(res.body.articles).to.be.an('array');
            expect(res.body.articles[0].author).to.equal('butter_bridge');
          });
      });
      it('GET status: 200 and accepts query for topic', () => {
        return request
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(res => {
            console.log(res.body);
            expect(res.body.articles[0].topic).to.equal('cats');
            expect(res.body.articles[0].author).to.equal('rogersop');
          });
      });
      it('GET status: 200 default sort order by date', () => {
        return request
          .get('/api/articles?topic=mitch')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.descendingBy('created_at');
          });
      });
      it('GET status: 200 accepts query for sort order', () => {
        return request
          .get('/api/articles?sort_by=author')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.descendingBy('author');
          });
      });
      it.only('GET status: 200 accepts query for sort direction', () => {
        return request
          .get('/api/articles?sort_by=title&&order=asc')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.ascendingBy('title');
          });
      });
    });
  });
});
