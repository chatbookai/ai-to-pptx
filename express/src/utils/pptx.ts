  import { Request, Response } from 'express';
  import { log } from './utils'
  import dotenv from 'dotenv';
  import bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';
  import axios from 'axios'
  import useragent from 'useragent';

  dotenv.config();

  import { db, getDbRecord, getDbRecordALL } from './db'

  type SqliteQueryFunction = (sql: string, params?: any[]) => Promise<any[]>;

  const secretKey: string = process.env.JWT_TOKEN_SECRET_KEY || "ChatBookAI"; 

  export const createJwtToken = (userId: string, email: string, role: string) => {
    const token = jwt.sign({ id: userId, email, role }, secretKey, { expiresIn: '10m' });

    return token;
  };