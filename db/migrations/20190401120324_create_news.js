exports.up = function(connection, Promise) {
  console.log('creating users table...');
  return connection.schema
    .createTable('users', usersTable => {
      usersTable
        .string('username')
        .primary()
        .unique();
      usersTable.string('name');
      usersTable.string('avatar_url');
    })
    .then(() => {
      return connection.schema.createTable('topics', topicsTable => {
        topicsTable.string('description');
        topicsTable
          .string('slug')
          .notNullable()
          .unique();
        topicsTable.increments('topic_id').primary();
      });
    })
    .then(() => {
      return connection.schema.createTable('articles', articlesTable => {
        articlesTable.increments('article_id').primary();
        articlesTable.string('title');
        articlesTable.string('topic');
        articlesTable
          .foreign('topic')
          .references('slug')
          .inTable('topics');
        articlesTable.string('author');
        articlesTable
          .foreign('author')
          .references('username')
          .inTable('users');
        articlesTable.text('body');
        articlesTable.integer('votes');
        articlesTable.bigInteger('created_at');
      });
    });
};

exports.down = function(connection, Promise) {
  console.log('dropping users table...');
  return connection.schema.dropTable('articles').then(() => {
    return connection.schema.dropTable('topics').then(() => {
      return connection.schema.dropTable('users');
    });
  });
};
