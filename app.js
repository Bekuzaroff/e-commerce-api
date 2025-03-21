const express = require('express');
const router = require('./routers/auth_router');

const app = express();

app.use(express.json());
app.use('/api/v1/auth', router);

module.exports = app;




