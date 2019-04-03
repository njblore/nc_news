exports.up = function(connection, Promise) {
  return connection.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('created_by');
    commentsTable
      .foreign('created_by')
      .references('username')
      .inTable('users')
      .onDelete('CASCADE');
    commentsTable.text('body');
    commentsTable
      .integer('article_id')
      .references('article_id')
      .inTable('articles')
      .onDelete('CASCADE');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.date('created_at');
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable('comments');
};
