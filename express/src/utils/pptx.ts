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

  export async function setTitle(Data: any) {
    console.log("Data", Data)
    const updateSetting = db.prepare('update pptx set title = ? where id = ?');
    updateSetting.run(Data.title, Data.id);
    updateSetting.finalize();
    return {"status":"ok", "msg":"Update title success"}
  }
  
  export async function setTheme(Data: any) {
    console.log("Data", Data)
    const updateSetting = db.prepare('update pptx set theme = ? where id = ?');
    updateSetting.run(JSON.stringify(Data.theme), Data.id);
    updateSetting.finalize();
    return {"status":"ok", "msg":"Update theme success"}
  }

  export async function setViewportRatio(Data: any) {
    console.log("Data", Data)
    const updateSetting = db.prepare('update pptx set viewportRatio = ? where id = ?');
    updateSetting.run(Number(Data.viewportRatio), Data.id);
    updateSetting.finalize();
    return {"status":"ok", "msg":"Update viewportRatio success"}
  }

  export async function setSlides(Data: any) {
    console.log("Data", Data)
    const updateSetting = db.prepare('update pptx set slides = ? where id = ?');
    updateSetting.run(JSON.stringify(Data.slides), Data.id);
    updateSetting.finalize();
    return {"status":"ok", "msg":"Update slides success"}
  }