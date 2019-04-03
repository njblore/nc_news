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
    it('GET status: 404 and serves message route not found for invalid route', () => {
      return request
        .get('/notaroute')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Route Not Found');
        });
    });
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
      it('POST/PUT/PATCH/DELETE status: 405 and serves message method not allowed', () => {
        return request
          .post('/api/topics')
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal('Method Not Allowed');
          });
      });
      it('INVALID QUERY status 200', () => {
        return request
          .get('/api/topics?slug=cats')
          .expect(200)
          .then(res => {
            expect(res.body.topics).to.be.an('array');
            expect(res.body.topics[0]).to.contain.keys('slug', 'description');
          });
      });
    });
    describe.only('/api/articles', () => {
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
      it('GET status 200 and serves empty array for author in db with no content', () => {
        return request
          .get('/api/articles?author=pinkelephant')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.eql([]);
          });
      });
      it('GET status 404 for author not in db', () => {
        return request
          .get('/api/articles?author=penelope')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.eql('Author Not Found');
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
      it('GET status 404 for topic not in db', () => {
        return request
          .get('/api/articles?topic=mushrooms')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.eql('Topic Not Found');
          });
      });
      it('GET status 200 and serves empty array for topic in db with no content', () => {
        return request
          .get('/api/articles?topic=homeopathy')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.eql([]);
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
      // it('INVALID SORT BY status: 400', () => {
      //   return request
      //     .get('/api/articles/sort_by=telemetry')
      //     .expect(400)
      //     .then(res => {
      //       expect(res.body.msg).to.equal('Bad Request');
      //     });
      // });
      // it('INVALID ORDER for sorting status: 400', () => {
      //   return request
      //     .get('/api/articles?order=tobasco')
      //     .expect(400)
      //     .then(res => {
      //       expect(res.body.msg).to.equal('Bad Request');
      //     });
      // });
      it('POST/PUT/PATCH/DELETE status: 405 and serves message method not allowed', () => {
        return request
          .post('/api/articles')
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal('Method Not Allowed');
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
      it('PATCH status: 200 when there are no inc_votes on the body', () => {
        return request
          .patch('/api/articles/3')
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(1);
          });
      });
      it('INVALID VOTES status: 400 when there are invalid inc_votes value on the body', () => {
        return request
          .patch('/api/articles/1')
          .send({ inc_votes: 'turtle' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('PATCH EXTRA CONTENT status: 200', () => {
        return request
          .patch('/api/articles/2')
          .send({ inc_votes: 1, tortellini: true })
          .expect(200)
          .then(res => {
            expect(res.body.article).to.contain.keys(
              'votes',
              'article_id',
              'topic',
              'author',
              'body',
              'created_at',
            );
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
      it('ARTICLE ID NOT FOUND Status: 404 ', () => {
        return request
          .get('/api/articles/290')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Article Not Found');
          });
      });
      it('PUT/POST status: 405 and serves message method not allowed', () => {
        return request
          .post('/api/articles/1')
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal('Method Not Allowed');
          });
      });
      it('INVALID ID status: 400', () => {
        return request
          .get('/api/articles/blue')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
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
      it('INVALID SORT BY status: 400', () => {
        return request
          .get('/api/articles/3/comments?sort_by=france')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('INVALID ORDER for sorting status: 400', () => {
        return request
          .get('/api/articles/1/comments?order=fishfingers')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
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
      it('INVALID ID status: 404', () => {
        return request
          .get('/api/articles/666/comments')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Article Not Found');
          });
      });
      it('PUT/DELETE status: 405 and serves message method not allowed', () => {
        return request
          .delete('/api/articles/1/comments')
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal('Method Not Allowed');
          });
      });
      it('INVALID ID status: 400 for invalid article_id', () => {
        return request
          .get('/api/articles/flamingos/comments')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
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
      it('PATCH status: 200 when there are no inc_votes on the body', () => {
        return request
          .patch('/api/comments/3')
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body.comment.votes).to.equal(101);
          });
      });
      it('INVALID VOTES status: 400 when there are no inc_votes on the body', () => {
        return request
          .patch('/api/comments/3')
          .send({ inc_votes: 'banana' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('PATCH EXTRA CONTENT status: 200', () => {
        return request
          .patch('/api/comments/5')
          .send({ inc_votes: 10, send_in_clowns: false })
          .expect(200)
          .then(res => {
            expect(res.body.comment).to.contain.keys(
              'comment_id',
              'created_by',
              'body',
              'article_id',
              'votes',
              'created_at',
            );
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
      it('POST/PUT status: 405 and serves message method not allowed', () => {
        return request
          .post('/api/comments/1')
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal('Method Not Allowed');
          });
      });
      it('INVALID ID status: 400', () => {
        return request
          .patch('/api/comments/pigeon')
          .send({ inc_votes: 10 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
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
      it('Status 404 and message Route not found for user not in db', () => {
        return request
          .get('/api/users/fatherchristmas')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('User Not Found');
          });
      });
      it('POST/PUT/PATCH/DELETE status: 405 and serves message method not allowed', () => {
        return request
          .delete('/api/users/butter_bridge')
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal('Method Not Allowed');
          });
      });
    });
  });
});
