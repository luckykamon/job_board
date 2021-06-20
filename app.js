const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var usersRouter = require('./routes/users');
var offresRouter = require('./routes/offres');
var candRouter = require("./routes/candidature");
var compeRouter = require("./routes/competences");
var typesRouter = require("./routes/types");
var societeRouter = require("./routes/societe");
var employerRouter = require("./routes/employer");
var employerBisRouter = require("./routes/employer_bis");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/offres', offresRouter);
app.use('/cand', candRouter);
app.use('/compe', compeRouter);
app.use('/types', typesRouter);
app.use('/societe', societeRouter);
app.use('/employer', employerRouter);
app.use('/employerBis', employerBisRouter);

module.exports = app;
