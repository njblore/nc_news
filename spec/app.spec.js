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
            expect(res.body.articles).to.be.an('array');
            expect(res.body.articles[0].author).to.equal('butter_bridge');
          });
      });
      it('GET status: 200 and accepts query for topic', () => {
        return request
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(res => {
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
      it('GET status: 200 accepts query for sort direction', () => {
        return request
          .get('/api/articles?sort_by=title&&order=asc')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.ascendingBy('title');
          });
      });
    });
    describe('/api/articles/:article_id', () => {
      it('GET status: 200 serves a single article with given id', () => {
        return request
          .get('/api/articles/1')
          .expect(200)
          .then(res => {
            expect(res.body.article).to.contain.keys(
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes',
              'comment_count',
            );
          });
      });
      it('PATCH status: 200 accepts inc_votes object and adds votes to an article, returns the amended object', () => {
        return request
          .patch('/api/articles/2')
          .send({ inc_votes: 10 })
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(10);
          });
      });
      it('DELETE status: 204 deletes article with given id and responds with no content', () => {
        return request
          .delete('/api/articles/3')
          .expect(200)
          .then(res => {
            console.log(res.body);
            expect(res.body.msg).to.equal(
              'Article with id 3 has been deleted.',
            );
          });
      });
    });
    describe('/api/articles/:article_id/comments', () => {
      it('GET status: 200 serves an array of comment objects for an article', () => {
        return request
          .get('/api/articles/1/comments')
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.an('array');
            expect(res.body.comments[0]).to.contain.keys(
              'comment_id',
              'votes',
              'created_at',
              'author',
              'body',
            );
          });
      });
      it('GET status: 200 sort order default to created_at', () => {
        return request
          .get('/api/articles/1/comments')
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.descendingBy('created_at');
          });
      });
      it('GET status: 200 accepts query for sort_by', () => {
        return request
          .get('/api/articles/1/comments?sort_by=author')
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.descendingBy('author');
          });
      });
      it('GET status: 200 accepts query for order asc or desc', () => {
        return request
          .get('/api/articles/1/comments?sort_by=author&&order=asc')
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.ascendingBy('author');
          });
      });
      it('POST status: 201 posts comment to article at article-id', () => {
        return request
          .post('/api/articles/1/comments')
          .send({
            username: 'icellusedkars',
            body: 'This article is a steaming heap of mashed potatoes.',
          })
          .expect(201)
          .then(res => {
            expect(res.body.comment).to.contain.keys(
              'comment_id',
              'created_at',
              'created_by',
              'body',
              'article_id',
              'votes',
            );
            expect(res.body.comment.body).to.equal(
              'This article is a steaming heap of mashed potatoes.',
            );
          });
      });
    });
    describe('/api/comments/:comment_id', () => {
      it('PATCH status: 200 serves a comment updated with new votes', () => {
        return request
          .patch('/api/comments/5')
          .send({ inc_votes: 10 })
          .expect(200)
          .then(res => {
            expect(res.body.comment).to.contain.keys(
              'comment_id',
              'votes',
              'created_at',
              'created_by',
              'body',
            );
            expect(res.body.comment.votes).to.equal(10);
          });
      });
      it('DELETE status: 200 returns confirmation of removed comment', () => {
        return request
          .delete('/api/comments/2')
          .expect(200)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Comment with id 2 has been removed.',
            );
          });
      });
    });
    describe('/api/users/:username', () => {
      it('GET status: 200 serves a user object', () => {
        return request
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(res => {
            expect(res.body.user).to.contain.keys(
              'username',
              'avatar_url',
              'name',
            );
          });
      });
    });
  });
});

describe('Error Handling', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe('Route Not Found', () => {
    it('GET status: 404 and serves message route not found for invalid route', () => {
      return request
        .get('/notaroute')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Route Not Found');
        });
    });
    it('Status 404 and message Route not found for user not in db', () => {
      return request
        .get('/api/users/fatherchristmas')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Route Not Found');
        });
    });
    it('Status 404 and message Route not found for article_id not in db', () => {
      return request
        .get('/api/articles/290')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Route Not Found');
        });
    });
  });
  describe('Method Not Allowed', () => {
    it('POST/PUT/PATCH on routes where not allowed status: 405 and serves message method not allowed', () => {
      return request
        .post('/api/articles')
        .expect(405)
        .then(res => {
          expect(res.body.msg).to.equal('Method Not Allowed');
        });
    });
  });
  describe('Bad queries', () => {
    it('status 400 and serves message bad request for invalid column names', () => {
      return request
        .get('/api/articles?sort_by=lemondrops')
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Bad Request');
        });
    });
    it('status 400 and serves message bad request for invalid article_id', () => {
      return request
        .get('/api/articles/blue')
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Bad Request');
        });
    });
    it('status 400 and serves message bad request for missing inc_votes on request body', () => {
      return request
        .patch('/api/comments/1')
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Bad Request');
        });
    });
    it('status 400 and serves message bad request for invalid inc_votes on comments request body', () => {
      return request
        .patch('/api/comments/1')
        .send({ inc_votes: 'shovel' })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Bad Request');
        });
    });
    it('status 400 and serves message bad request for invalid inc_votes on articles request body', () => {
      return request
        .patch('/api/articles/1')
        .send({ inc_votes: 'shovel' })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Bad Request');
        });
    });
    it('status 400 and serves message bad request for extraneous items on request body', () => {
      return request
        .patch('/api/articles/1')
        .send({ inc_votes: 1, name: 'Excalibur' })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Bad Request');
        });
    });
  });
});
