exports.up = function(connection, Promise) {
  return connection.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('created_by');
    commentsTable
      .foreign('created_by')
      .references('username')
      .inTable('users');
    commentsTable.text('body');
    commentsTable.string('belongs_to');
    commentsTable
      .foreign('belongs_to')
      .references('title')
      .inTable('articles');
    commentsTable.integer('votes');
    commentsTable.date('created_at');
  });
};

exports.down = function(connection, Promise) {};
