import express, { Request, Response } from 'express';
import 'express-async-errors';
import path from 'path';
import { currentUserRouter } from './routes/currentuser';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from '../src/common';
import cookieSession from 'cookie-session';
import { updateUserRouter } from './routes/updateuser';
import { getUserRouter } from './routes/getuser';
import { deleteUserRouter } from './routes/deleteuser';
import cors from 'cors';
import helmet from 'helmet';
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(updateUserRouter);
app.use(getUserRouter);
app.use(deleteUserRouter);


app.all('*', async (req: Request, res: Response) => {
  res.status(404).send({message:'Not Found'});
});

app.use(errorHandler);
export { app };
