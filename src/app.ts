import express from 'express';
import path from 'path';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import db from './db/mongo';

import indexRouter from './routes';
import roomsRouter from './routes/rooms';
import zonesRouter from './routes/zones';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('MongoDB connected');
});

app.use('/', indexRouter);
app.use('/rooms', roomsRouter);
app.use('/zones', zonesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    // @ts-ignore
    res.locals.message = err.message;
    // @ts-ignore
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    // @ts-ignore
    res.status(err.status || 500);
    // @ts-ignore
    res.render('error');
});

export default app;
