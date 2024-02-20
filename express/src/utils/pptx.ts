  import { Request, Response } from 'express';
  import { log } from './utils'
  import dotenv from 'dotenv';
  import bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';
  import axios from 'axios'
  import useragent from 'useragent';

  dotenv.config();

  import { db, getDbRecord, getDbRecordALL } from './db'
  import { slidesTemplate } from './const.pptx'

  type SqliteQueryFunction = (sql: string, params?: any[]) => Promise<any[]>;

  const secretKey: string = process.env.JWT_TOKEN_SECRET_KEY || "ChatBookAI"; 

  export const getPPTXTemplate = () => {

    return slidesTemplate;
  };