import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// import path from 'path';

import db from './db/mongo'; //
// import config from './config'; //
import * as middlewares from './middlewares';

import roomsRouter from './routes/rooms';
import zonesRouter from './routes/zones';
import resetRouter from './routes/reset';
import mudRouter from './routes/mud';
import walkerRouter from './routes/walker';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  /* eslint-disable no-console */
  console.log('MongoDB connected');
  /* eslint-enable no-console */
});

app.use('/rooms', roomsRouter);
app.use('/zones', zonesRouter);
app.use('/reset', resetRouter);
app.use('/mud', mudRouter);
app.use('/walk', walkerRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
