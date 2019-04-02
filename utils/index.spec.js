const { expect } = require('chai');
const { convertDate, createArticleRef, formatComments } = require('./index');
const comments = require('../db/data/test-data/comments');

describe('createArticleRef', () => {
  it('takes an array and returns an object', () => {
    expect(createArticleRef([{ article_id: 1, title: 'hello' }])).to.eql({
      hello: 1,
    });
  });
  it('takes an array of objects and returns an object with key value pairs', () => {
    expect(
      createArticleRef([
        {
          article_id: 1,
          title: 'Sony Vaio; or, The Laptop',
          topic: 'mitch',
          author: 'icellusedkars',
        },
        {
          article_id: 2,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
        },
      ]),
    ).to.eql({
      'Sony Vaio; or, The Laptop': 1,
      'Eight pug gifs that remind me of mitch': 2,
    });
  });
});
describe('formatComments', () => {
  it('returns a new arr of objects with correct field added', () => {
    expect(
      formatComments([{ belongs_to: 'Cats on the prowl', comment_id: 1 }], {
        'Cats on the prowl': 2,
      }),
    ).to.eql([{ article_id: 2, comment_id: 1 }]);
    expect(
      formatComments(
        [
          { belongs_to: 'Feline Frenzy', comment_id: 4 },
          { belongs_to: 'Jelly Bean Mania', comment_id: 3 },
          { belongs_to: 'Feline Frenzy', comment_id: 2 },
        ],
        { 'Feline Frenzy': 3, 'Jelly Bean Mania': 2 },
      ),
    ).to.eql([
      { article_id: 3, comment_id: 4 },
      { article_id: 2, comment_id: 3 },
      { article_id: 3, comment_id: 2 },
    ]);
  });
  it('doesnt mutate the original array', () => {
    const original = [
      { belongs_to: 'Feline Frenzy', comment_id: 4 },
      { belongs_to: 'Jelly Bean Mania', comment_id: 3 },
      { belongs_to: 'Feline Frenzy', comment_id: 2 },
    ];
    formatComments(original, { 'Feline Frenzy': 3, 'Jelly Bean Mania': 2 });
    expect(original).to.eql([
      { belongs_to: 'Feline Frenzy', comment_id: 4 },
      { belongs_to: 'Jelly Bean Mania', comment_id: 3 },
      { belongs_to: 'Feline Frenzy', comment_id: 2 },
    ]);
  });
});
