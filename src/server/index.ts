import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import BodyParser from 'body-parser';
import mongoDB from './mongodb';
import api from './api';
import asyncErrorHandler from './middlewares/asyncErrorHandler';

import { MAX_FILE_SIZE } from './config/constants.json';

const app = express();

mongoDB();

app.use(helmet({ hsts: false }));
app.use(cors());

app.use(BodyParser.json());
app.use(BodyParser.raw({ type: 'audio/mpeg', limit: MAX_FILE_SIZE }));

app.use('/api', api());

app.use(asyncErrorHandler);

export default app;
