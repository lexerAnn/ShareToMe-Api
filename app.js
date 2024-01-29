const express = require('express');
const app = express();

app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ extended: false, limit:'50mb' }));

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const noteRouter = require('./routes/links');


app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/note', noteRouter);
//Testing this CL/CD


module.exports = app;
