import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@js-ticketing-ms/common';
import { newPaymentRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser as any);

app.use(newPaymentRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler as any);

export { app };
