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
  it('GET status: 404 and serves message route not found for invalid route', () => {
    return request
      .get('/notaroute')
      .expect(404)
      .then(res => {
        expect(res.body.msg).to.equal('Route Not Found');
      });
  });
  describe('/api', () => {
    it('GET status:200', () => {
      return request
        .get('/api')
        .expect(200)
        .then(res => {
          expect(res.body.endpoints).to.contain.keys(
            '/api/topics',
            '/api/articles',
            '/api/articles/article_id/comments',
            '/api/comments/:comment_id',
            '/api/users/:username',
          );
        });
    });
    it('DELETE/PATCH/PUT/POST status: 405', () => {
      return request
        .delete('/api')
        .expect(405)
        .then(res => {
          expect(res.body.msg).to.equal('Method Not Allowed');
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
      it('POST status: 201', () => {
        return request
          .post('/api/topics')
          .send({
            slug: 'paranormal',
            description: 'unexplained and unusual phenomena',
          })
          .expect(201)
          .then(res => {
            expect(res.body.topic).to.contain.keys('slug', 'description');
            expect(res.body.topic.slug).to.equal('paranormal');
          });
      });
      it('POST status: 422 for slug aready in database', () => {
        return request
          .post('/api/topics')
          .send({ slug: 'cats', description: 'feline friends' })
          .expect(422)
          .then(res => {
            expect(res.body.msg).to.equal('Topic Already Exists');
          });
      });
      it('POST status: 400 for missing slug on the body', () => {
        return request
          .post('/api/topics')
          .send({ description: 'fun fun fun' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("Missing Value for Key 'slug'");
          });
      });
      it('PUT/PATCH/DELETE status: 405 and serves message method not allowed', () => {
        return request
          .patch('/api/topics')
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
      it('GET status: 200 adds a total count property showing total number of articles', () => {
        return request
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(res => {
            expect(res.body).to.contain.keys('total_count');
            expect(res.body.total_count).to.equal(3);
          });
      });
      it('GET status: 200 adds a total count property that is applied after any filters', () => {
        return request
          .get('/api/articles?author=butter_bridge&&limit=1')
          .expect(200)
          .then(res => {
            expect(res.body.total_count).to.equal(3);
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
      it('GET status: 200 default result limit to 10', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.lengthOf(10);
          });
      });
      it('GET status: 200 accepts query for result limit', () => {
        return request
          .get('/api/articles?limit=11')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.have.lengthOf(11);
          });
      });
      it('GET status: 200 accepts query p for page to start at', () => {
        return request
          .get('/api/articles?limit=1&&sort_by=title&&order=asc&&p=2')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.have.lengthOf(1);
            expect(res.body.articles).to.be.ascendingBy('title');
            expect(res.body.articles[0].title).to.equal(
              'Does Mitch predate civilisation?',
            );
          });
      });
      it('GET status: 400 for bad limit query', () => {
        return request
          .get('/api/articles?limit=tuna')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Invalid Limit');
          });
      });
      it('GET status: 400 for bad p query', () => {
        return request
          .get('/api/articles?p=pineapple')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('GET status: 200 default sort order by date', () => {
        return request
          .get('/api/articles')
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
      it('GET status 200 and serves empty array for author in db with no content', () => {
        return request
          .get('/api/articles?author=pinkelephant')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.eql([]);
          });
      });
      it('POST status: 201', () => {
        return request
          .post('/api/articles')
          .send({
            author: 'pinkelephant',
            title: 'Hare Krishnas',
            topic: 'religion',
            body:
              'Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare, Hare Rama, Hara Rama, Rama Rama, Hare Hare.” “Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare, Hare Rama, Hara Rama, Rama Rama, Hare Hare,” said members of the International Society for Krishna Consciousness, adding “Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare, Hare Rama, Hara Rama, Rama Rama, Hare Hare.” “Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare, Hare Rama, Hara Rama, Rama Rama, Hare Hare. Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare, Hare Rama, Hara Rama, Rama Rama, Hare Hare.',
          })
          .expect(201)
          .then(res => {
            expect(res.body.article).to.contain.keys(
              'author',
              'created_at',
              'body',
              'topic',
              'votes',
              'title',
            );
            expect(res.body.article.votes).to.equal(0);
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
          .get('/api/articles?topic=religion')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.eql([]);
          });
      });
      it('GET INVALID SORT BY status: 400', () => {
        return request
          .get('/api/articles/sort_by=telemetry')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('GET INVALID ORDER for sorting status: 400', () => {
        return request
          .get('/api/articles?order=tobasco')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Invalid Order');
          });
      });
      it('POST status: 404 for author not in db', () => {
        return request
          .post('/api/articles')
          .send({
            author: 'fluffybunnies',
            topic: 'mitch',
            title: 'Fruit',
            body: 'Small',
          })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Key (author)=(fluffybunnies) is not present in table "users".',
            );
          });
      });
      it('POST status: 404 for topic not in db', () => {
        return request
          .post('/api/articles')
          .send({
            author: 'butter_bridge',
            topic: 'fluffy',
            title: 'Fruit',
            body: 'Small',
          })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Key (topic)=(fluffy) is not present in table "topics".',
            );
          });
      });
      it('POST status: 400 for missing topic/author on the body', () => {
        return request
          .post('/api/articles')
          .send({ author: 'pinkelephant' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Missing Value for Key author/topic/title/body',
            );
          });
      });
      it('POST status: 400 for missing keys on the body', () => {
        return request
          .post('/api/articles')
          .send({ topic: 'cats', author: 'pinkelephant', title: 'Yarn' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Missing Value for Key author/topic/title/body',
            );
          });
      });
      it('PUT/PATCH/DELETE status: 405 and serves message method not allowed', () => {
        return request
          .delete('/api/articles')
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
            expect(res.body.article.votes).to.equal(0);
          });
      });
      it('PATCH INVALID VOTES status: 400 when there are invalid inc_votes value on the body', () => {
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
      it('DELETE status: 204 deletes article with given id', () => {
        return request.delete('/api/articles/3').expect(204);
      });
      it('GET ARTICLE ID NOT FOUND Status: 404 ', () => {
        return request
          .get('/api/articles/290')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Article Not Found');
          });
      });
      it('GET INVALID ID status: 400', () => {
        return request
          .get('/api/articles/blue')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('PATCH ARTICLE ID NOT FOUND status: 404', () => {
        return request
          .patch('/api/articles/300')
          .send({ inc_votes: 10 })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Article Not Found');
          });
      });
      it('PATCH INVALID ID status: 400', () => {
        return request
          .patch('/api/articles/articuno')
          .send({ inc_votes: 10 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('DELETE ARTICLE ID NOT FOUND status: 404', () => {
        return request
          .delete('/api/articles/666')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Article Not Found');
          });
      });
      it('DELETE INVALID ID status: 404', () => {
        return request
          .delete('/api/articles/pizza')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
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
              'author',
              'body',
              'article_id',
              'votes',
            );
            expect(res.body.comment.body).to.equal(
              'This article is a steaming heap of mashed potatoes.',
            );
          });
      });
      it('GET status: 200 sort order default to created_at', () => {
        return request
          .get('/api/articles/3/comments')
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
      it('GET status: 200 default max number of results shown is 10', () => {
        return request
          .get('/api/articles/1/comments')
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.have.lengthOf(10);
          });
      });
      it('GET status: 200 accepts limit query', () => {
        return request
          .get('/api/articles/1/comments?limit=5')
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.have.lengthOf(5);
          });
      });
      it('GET status: 200 accepts limit for p', () => {
        return request
          .get('/api/articles/1/comments?sort_by=body&&limit=1&&p=2')
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.have.lengthOf(1);
            expect(res.body.comments[0].body).to.equal(
              'Superficially charming',
            );
          });
      });
      it('GET INVALID p status: 400', () => {
        return request
          .get('/api/articles/1/comments?p=phonics')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('GET INVALID LIMIT status:400', () => {
        return request
          .get('/api/articles/1/comments?limit=sky')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Invalid Limit');
          });
      });
      it('GET INVALID SORT BY status: 400', () => {
        return request
          .get('/api/articles/3/comments?sort_by=france')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('GET INVALID ORDER for sorting status: 400', () => {
        return request
          .get('/api/articles/1/comments?order=fishfingers')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('GET INVALID ID status: 404', () => {
        return request
          .get('/api/articles/666/comments')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Article Not Found');
          });
      });
      it('POST INVALID ID status: 404', () => {
        return request
          .post('/api/articles/666/comments')
          .send({
            username: 'icellusedkars',
            body: 'This article is a steaming heap of mashed potatoes.',
          })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Key (article_id)=(666) is not present in table "articles".',
            );
          });
      });
      it('POST missing keys on body status: 400', () => {
        request
          .post('/api/articles/1/comments')
          .send({ body: 'Hate it!' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('POST extra keys on body status 201', () => {
        request
          .post('/api/articles/1/comments')
          .send({
            username: 'icellusedkars',
            body: 'Great work keep it up.',
            chickens: 'count em',
          })
          .expect(201)
          .then(res => {
            expect(res.body.comment).to.contain.keys(
              'comment_id',
              'body',
              'article_id',
              'votes',
            );
          });
      });
      it('GET INVALID ID status: 400 for invalid article_id', () => {
        return request
          .get('/api/articles/flamingos/comments')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
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
      it('DELETE status: 204', () => {
        return request.delete('/api/comments/2').expect(204);
      });
      it('PATCH status: 200 when there are no inc_votes on the body', () => {
        return request
          .patch('/api/comments/3')
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body.comment.votes).to.equal(100);
          });
      });
      it('PATCH INVALID VOTES status: 400 when there are non integer inc_votes on the body', () => {
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
      it('PATCH INVALID ID status: 400', () => {
        return request
          .patch('/api/comments/pigeon')
          .send({ inc_votes: 10 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('PATCH status: 404 for ID not in db', () => {
        return request
          .patch('/api/comments/666')
          .send({ inc_votes: 5 })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Comment Not Found');
          });
      });
      it('DELETE INVALID ID status: 400', () => {
        return request
          .delete('/api/comments/chihuahua')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad Request');
          });
      });
      it('DELETE ID NOT FOUND status: 404', () => {
        return request
          .delete('/api/comments/666')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Comment Not Found');
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
    });
    describe('/api/users', () => {
      it('POST status: 201', () => {
        return request
          .post('/api/users')
          .send({
            username: 'stephosaurus',
            avatar_url: 'url.com',
            name: 'Steph',
          })
          .expect(201)
          .then(res => {
            expect(res.body.user).to.contain.keys(
              'username',
              'name',
              'avatar_url',
            );
            expect(res.body.user.name).to.equal('Steph');
          });
      });
      it('GET status: 200', () => {
        return request
          .get('/api/users')
          .expect(200)
          .then(res => {
            expect(res.body.users).to.be.an('array');
            expect(res.body.users[0]).to.contain.keys(
              'username',
              'avatar_url',
              'name',
            );
          });
      });
      it('POST status: 422 for user already exists', () => {
        return request
          .post('/api/users')
          .send({ username: 'butter_bridge', avatar_url: 'url', name: 'Suze' })
          .expect(422)
          .then(res => {
            expect(res.body.msg).to.equal('User Already Exists');
          });
      });
      it('POST status: 400 for missing username on body', () => {
        return request
          .post('/api/users')
          .send({ name: 'Jim', avatar_url: 'url' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("Missing Value for Key 'username'");
          });
      });
      it('POST status: 400 for missing name on body', () => {
        return request
          .post('/api/users')
          .send({ username: 'coffeeTime', avatar_url: 'url' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Missing Key "name".');
          });
      });
      it('PUT/PATCH/DELETE status 405: Method Not Allowed', () => {
        return request
          .patch('/api/users')
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal('Method Not Allowed');
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
      it('PATCH status: 200 updates avatar_url', () => {
        return request
          .patch('/api/users/pinkelephant')
          .send({ avatar_url: 'http://tinyurl.com/y25kru2r' })
          .expect(200)
          .then(res => {
            expect(res.body.user).to.contain.keys(
              'username',
              'name',
              'avatar_url',
            );
            expect(res.body.user.avatar_url).to.equal(
              'http://tinyurl.com/y25kru2r',
            );
          });
      });
      it('PATCH status: 200 updates name', () => {
        return request
          .patch('/api/users/pinkelephant')
          .send({ name: 'Jolene' })
          .expect(200)
          .then(res => {
            expect(res.body.user).to.contain.keys(
              'username',
              'name',
              'avatar_url',
            );
            expect(res.body.user.name).to.equal('Jolene');
          });
      });
      it('GET Status 404 and message Route not found for user not in db', () => {
        return request
          .get('/api/users/fatherchristmas')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('User Not Found');
          });
      });
      it('PATCH status: 404 for username not in db', () => {
        return request
          .patch('/api/users/chellyfish')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('User Not Found');
          });
      });
      it('PATCH status: 200 for missing avatar_url on body', () => {
        return request
          .patch('/api/users/pinkelephant')
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body.user).to.contain.keys(
              'username',
              'name',
              'avatar_url',
            );
            expect(res.body.user.avatar_url).to.equal(
              'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
            );
          });
      });
      it('PATCH status 200 for missing name on body', () => {
        return request
          .patch('/api/users/pinkelephant')
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body.user).to.contain.keys(
              'username',
              'name',
              'avatar_url',
            );
            expect(res.body.user.name).to.equal('justine');
          });
      });
      it('PUT/DELETE/POST status: 405 and serves message method not allowed', () => {
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
