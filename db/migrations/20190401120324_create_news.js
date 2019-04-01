exports.up = function(connection, Promise) {
  console.log('creating users table...');
  return connection.schema
    .createTable('users', usersTable => {
      usersTable.string('username').primary();
      usersTable.string('name');
      usersTable.string('avatar_url');
    })
    .then(() => {
      return connection.schema.createTable('topics', topicsTable => {
        topicsTable.string('description');
        topicsTable.string('slug').notNullable();
        topicsTable.increments('topic_id');
      });
    });
};

exports.down = function(connection, Promise) {
  console.log('dropping users table...');
  return connection.schema.dropTable('users');
};
