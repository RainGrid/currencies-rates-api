import compression from 'compression';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import HttpStatus from 'http-status-codes';
import ratesRouter from './components/rates/ratesRouter';
import { ApiError } from './errors';

const app = express();

app
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(helmet())
  .use(compression())
  .use(cors());

app.use('/api/', ratesRouter);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ApiError) {
    res.status(error.status).send({ message: error.message });
  } else {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Error' });
  }
});

export default app;
