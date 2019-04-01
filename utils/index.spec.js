const { expect } = require('chai');
const { convertDate } = require('./index');
const comments = require('../db/data/test-data/comments');

describe('', () => {
  it('converts js date time to iso time', () => {
    expect(convertDate(comments));
  });
});
