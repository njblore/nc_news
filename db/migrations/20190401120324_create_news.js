exports.up = function(connection, Promise) {
  console.log('creating tables...');
  return connection.schema.createTable('users', usersTable => {
    usersTable
      .string('username')
      .primary()
      .unique();
    usersTable.string('name');
    usersTable.string('avatar_url');
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable('comments').then(() => {
    return connection.schema.dropTable('articles').then(() => {
      return connection.schema.dropTable('topics').then(() => {
        return connection.schema.dropTable('users');
      });
    });
  });
};
