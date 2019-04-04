const app = require('./app');
const environment = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 9090;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
