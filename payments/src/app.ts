import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@js-ticketing-ms/common';
import { newPaymentRouter } from './routes/new';

const app = express();
// Sin trust proxy: Express ve la IP del proxy, no la IP real del cliente 
// → IP del ingress controller (ej: 10.0.0.5)
// Con trust proxy: Express confía en los headers del proxy y obtiene la IP real del cliente
// → IP real del cliente (ej: 192.168.1.100)
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(newPaymentRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
