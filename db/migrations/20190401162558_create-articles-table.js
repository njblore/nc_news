exports.up = function(connection, Promise) {
  return connection.schema.createTable('articles', articlesTable => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title');
    articlesTable.string('topic');
    articlesTable
      .foreign('topic')
      .references('slug')
      .inTable('topics')
      .onDelete('CASCADE');
    articlesTable.string('author');
    articlesTable
      .foreign('author')
      .references('username')
      .inTable('users')
      .onDelete('CASCADE');
    articlesTable.text('body');
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.date('created_at');
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable('articles');
};
