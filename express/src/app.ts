// app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { join } from 'path';

import { initChatBookDbExec } from './utils/db';

import userRouter from './router/user'
import utilsRouter from './router/utils'
import pptxRouter from './router/pptx'

//Start Express Server
const app = express();
const port = 1988;
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

//Initial Database and Folder
initChatBookDbExec()

//Schedule Task for Parse Upload Files
cron.schedule('*/1 * * * *', () => {
  console.log('Task Begin !');
  console.log('Task End !');
});

app.use('/', userRouter);
app.use('/', utilsRouter);
app.use('/', pptxRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // 处理身份验证错误
  if (err.name === 'AuthenticationError') {
    console.error('AuthenticationError:', err.message);
    res.status(200).json({ error: 'Authentication failed' });
  } 
  else {
    // 处理其他错误
    console.error('Unexpected error:', err);
    res.status(200).json({ error: 'Internal Server Error' });
  }
});

app.use(express.static(join(__dirname, '../../out')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
