# Northcoders News API

An API for the back end of a northcoders news site, where users can post articles and comments and vote on them.

It uses a PSQL database and is built with KNEX.js and Express, hosted on Heroku. View the API live here: https://northcoders-news-server.herokuapp.com/api

## Installation

```
$ npm install knex, pg, express
```

Create a file in the root called knexfile.js and paste in the following code:

```
const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

const customConfigs = {
  development: {
    connection: {
      database: 'nc_news',
      //username: '',
      //password: '',
    },
  },
  test: {
    connection: {
      database: 'nc_news_test',
      //username: '',
      //password: '',
    },
  },
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };

```

If you are using Linux you will need to un-comment and fill in your username and password in customConfigs.

## Testing

```
$ npm install mocha, chai, supertest -D
$ npm t

```

## Usage

```
$ npm run setup-dbs
$ npm run seed
```
