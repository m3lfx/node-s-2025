const express = require('express');
const app = express();
const cors = require('cors')

const items = require('./routes/item');

app.use(cors())
app.use('/api/v1', items);
module.exports = app