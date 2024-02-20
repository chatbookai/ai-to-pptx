  import { Request, Response } from 'express';
  import { log } from './utils'
  import dotenv from 'dotenv';
  import bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';
  import axios from 'axios'
  import useragent from 'useragent';
  import Arweave from 'arweave'

  dotenv.config();

  import { db, getDbRecord, getDbRecordALL } from './db'

  const arweave = Arweave.init(urlToSettings("http://112.170.68.77:1985"))


  type SqliteQueryFunction = (sql: string, params?: any[]) => Promise<any[]>;

  const secretKey: string = process.env.JWT_TOKEN_SECRET_KEY || "ChatBookAI"; 

  export const createJwtToken = (userId: string, email: string, role: string) => {
    const token = jwt.sign({ id: userId, email, role }, secretKey, { expiresIn: '10m' });

    return token;
  };

  export const verifyJwtToken = (token: string) => {
    try {
      const decoded = jwt.verify(token, secretKey);

      return decoded;
    } 
    catch (error) {

      return null;
    }
  };

  export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  };

  export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
  };

  export const passwordValidator = (password: string): boolean => {

    // 正则表达式，要求至少包含一个数字、一个字母，且长度至少为八位
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
  
    return passwordRegex.test(password);
  };

  export async function checkUserToken(token: string) {
    const userTokenData: any = verifyJwtToken(token);
    if(userTokenData) {
        return {"status":"ok", "msg":"User token is valid", "data": userTokenData}
    }
    else {
        return {"status":"error", "msg":"Token is invalid"}
    }
  }

  export async function checkUserTokenXWE(token: string) {
    const buffer = Buffer.from(token, 'base64');
    const TxText = buffer.toString('utf-8');
    const Tx = JSON.parse(TxText)
    if(Tx && Tx.id && Tx.last_tx && Tx.format && Tx.format == 2 && Tx.owner && Tx.target && Tx.target == '72i2l5UJFwIb53gbUuiS9tKM-y1ooJnJFnyWltNEEBo' && Tx.quantity && Tx.signature) {
      if(Tx.quantity == 5000000000000) {
        //Check TX to remote host
        try {
          const txResult = await arweave.transactions.post(Tx);
          console.log("checkUserTokenXWE tx Result", txResult)
          if(txResult.status == 200 && txResult.statusText == 'OK') {
            //OK
            const Address = await ownerToAddress(Tx.owner)
            let getOneUserData = await getOneUser(Address)
            if(getOneUserData == null)  {
              const hashedPassword = await hashPassword(Address + Date.now());
              const insertUser = db.prepare('INSERT OR IGNORE INTO user (email, username, password, language, createtime) VALUES (?, ?, ?, ?, ?)');
              insertUser.run(Address, Address, hashedPassword, 'en', Date.now());
              insertUser.finalize();
            }
            getOneUserData = await getOneUser(Address)            
            console.log("getOneUserData", getOneUserData)

            return {"status":"ok", "msg":"User token is valid", "data": getOneUserData}
          }
          else {
            console.log("checkUserTokenXWE tx Error", txResult)
          }
        }
        catch(error: any) {
          console.log("checkUserTokenXWE TX Error", error)
        }
      }

    }

    return {"status":"error", "msg":"Token is valid"}
  }

  export async function checkUserTokenXWENotCostAmount(token: string) {
    const buffer = Buffer.from(token, 'base64');
    const TxText = buffer.toString('utf-8');
    const Tx = JSON.parse(TxText)
    if(Tx && Tx.id && Tx.last_tx && Tx.format && Tx.format == 2 && Tx.owner && Tx.target && Tx.target == '72i2l5UJFwIb53gbUuiS9tKM-y1ooJnJFnyWltNEEBo' && Tx.quantity && Tx.signature) {
      if(true) {
        const Address = await ownerToAddress(Tx.owner)
        const getOneUserData = await getOneUser(Address)            
        console.log("getOneUserData", getOneUserData)
        return {"status":"ok", "msg":"User token is valid", "data": getOneUserData}
      }
    }
    return {"status":"error", "msg":"Token is valid"}
  }

  export async function ownerToAddress(owner: string) {
    const pubJwk = {
        kty: 'RSA',
        e: 'AQAB',
        n: owner,
    }
    return await arweave.wallets.getAddress(pubJwk)
  }

  export async function userLoginLog(req: Request, email: string, action: string, msg: string) {
    const agent = useragent.parse(req.headers['user-agent']);
    const BrowserType = agent.family
    const BrowserVersion = agent.toVersion()
    const OperatingSystem = agent.os.family
    const Device = agent.device.family
    const ipaddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const ipaddress2 = (ipaddress as string).replace('::ffff:','');
    const insertSetting = db.prepare('INSERT OR IGNORE INTO userlog (email, browsertype, browserversion, os, device, location, country, ipaddress, recentactivities, action, msg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    if(ipaddress2 != "::1")  {
      try {
        const response = await axios.get(`https://ipinfo.io/${ipaddress2}/json`);
        const locationInfo = response.data;
        const location = locationInfo.city + ', ' + locationInfo.region + ', ' + locationInfo.country
        const country = locationInfo.country
        insertSetting.run(email, BrowserType, BrowserVersion, OperatingSystem, Device, location, country, ipaddress2, Date.now(), action, msg);
        insertSetting.finalize();
      }
      catch(error: any) {
      }
    }
  }

  export async function refreshUserToken(token: string) {
    const userTokenData: any = verifyJwtToken(token);
    if(userTokenData) {
      const createJwtTokenData = createJwtToken(userTokenData.id, userTokenData.email, userTokenData.role)
        return {"status":"ok", "msg":"User token is valid", "token": createJwtTokenData}
    }
    else {
        return {"status":"error", "msg":"Token is invalid"}
    }
  }

  export async function checkUserPassword(req: Request, email: string, password: string) {
    const getOneUserData: any = await getOneUser(email);
    if(getOneUserData && getOneUserData.user_status == '1') {
        const isPasswordMatch = await comparePasswords(password, getOneUserData.password);
        if(isPasswordMatch) {
            const msg = "Login successful"
            const createJwtTokenData = createJwtToken(getOneUserData.id, getOneUserData.email, getOneUserData.role)
            userLoginLog(req, email, 'Login Success', msg)

            return {"status":"ok", "msg":"Login successful", "token": createJwtTokenData, "data": {...getOneUserData, password:''}}
        }
        else {
            const msg = "Username not exist or password is error"
            userLoginLog(req, email, 'Login Failed', msg)

            return {"status":"error", "msg":msg}
        }
    }
    else if(getOneUserData && getOneUserData.user_status == '0') {
      const msg = "User is not allow to login"
      userLoginLog(req, email, 'Login Failed', msg)

      return {"status":"error", "msg":msg}
    }
    else {
        const msg = "Username not exist or password is error"
        userLoginLog(req, email, 'Login Failed', msg)

        return {"status":"error", "msg":msg}
    }
  }

  export async function changeUserPasswordByToken(token: string, data: any) {    
    const checkUserTokenData: any = await checkUserToken(token);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const getOneUserData: any = await getOneUser(checkUserTokenData.data.email);
      
      if(getOneUserData) {
          const isPasswordMatch = await comparePasswords(data.currentPassword, getOneUserData.password);
          if(isPasswordMatch) {
              if(!passwordValidator(data.newPassword)) {
      
                  return {"status":"error", "msg":"The password must contain both letters and numbers, and be at least 8 characters long"}
              }
              const hashedPassword = await hashPassword(data.newPassword);
              const updateSetting = db.prepare('update user set password = ? where email = ?');
              updateSetting.run(hashedPassword, checkUserTokenData.data.email);
              updateSetting.finalize();

              // User password change log
              // ...

              return {"status":"ok", "msg":"Change password successful"}
          }
          else {

              return {"status":"error", "msg":"Username not exist or password is error"}
          }
      }
      else {

          return {"status":"error", "msg":"Username not exist or password is error"}
      }
    }
    else {

      return {"status":"error", "msg":"Token is invalid in changeUserPasswordByToken"}
    }
  }

  export async function changeUserDetail(token: string, data: any) {
    console.log("data", data)
    const checkUserTokenData: any = await checkUserToken(token);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      console.log("checkUserTokenData", checkUserTokenData)
      const updateSetting = db.prepare('update user set firstname = ?, lastname = ?, organization = ?, mobile = ?, address = ?, state = ?, country = ?, language = ? where email = ?');
      updateSetting.run(data.firstname, data.lastname, data.organization, data.mobile, data.address, data.state, data.country, data.language, checkUserTokenData.data.email);
      updateSetting.finalize();

      return {"status":"ok", "msg":"Change user information successful"}
    }
    else {

      return {"status":"error", "msg":"Token is invalid in changeUserDetail"}
    }
  }

  export async function changeUserStatus(token: string, data: any) {
    console.log("data", data)
    const checkUserTokenData: any = await checkUserToken(token);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      console.log("checkUserTokenData", checkUserTokenData)
      const updateSetting = db.prepare('update user set user_status = ? where id = ?');
      updateSetting.run(data.user_status, data.id);
      updateSetting.finalize();

      return {"status":"ok", "msg":"Change user status successful"}
    }
    else {

      return {"status":"error", "msg":"Token is invalid in changeUserStatus"}
    }
  }

  export async function registerUser(email: string, username: string, password: string, confirm_password: string, language: string) {
    try{
        if(password != confirm_password) {

            return {"status":"error", "msg":"The passwords entered twice are different"}
        }
        if(!passwordValidator(password)) {

            return {"status":"error", "msg":"The password must contain both letters and numbers, and be at least 8 characters long"}
        }
        const getOneUserData: any = await getOneUser(email);
        if(getOneUserData) {
          return {"status":"error", "msg":"This email have used before"}
        }
        const hashedPassword = await hashPassword(password);
        const insertUser = db.prepare('INSERT OR IGNORE INTO user (email, username, password, language, createtime) VALUES (?, ?, ?, ?, ?)');
        insertUser.run(email, username, hashedPassword, language, Date.now());
        insertUser.finalize();
    }
    catch (error: any) {
      log('Error registerUser:', error.message);
    }

    return {"status":"ok", "msg":"Register user successful"}
  }

  export async function getOneUser(email: string) {
    const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT * from user where email = ? ", [email]);
 
    return Records ? Records : null;
  }

  export async function getOneUserByToken(token: string) {
    const checkUserTokenData: any = await checkUserToken(token);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const getOneUserData: any = await getOneUser(checkUserTokenData.data.email);
      if(getOneUserData) {

        return {"status":"ok", "msg":"Get one user information", "data": {...getOneUserData, password:''}}
      }
      else {       

        return {"status":"error", "msg":"User not exist", "data": null}
      }
    }
    else {

      return {"status":"error", "msg":"Token is invalid in getOneUserByToken", "data": null}
    }
  }

  export async function getUsers(pageid: number, pagesize: number) {
    const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
    const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
    const From = pageidFiler * pagesizeFiler;
    console.log("pageidFiler", pageidFiler)
    console.log("pagesizeFiler", pagesizeFiler)

    const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from user ");
    const RecordsTotal: number = Records ? Records.NUM : 0;

    const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT id, email, username, firstname, lastname, organization, role, mobile, address, state, zipcode, country, language, timezone, nickname, birthday, avatar, mobile_status, google_auth, github_auth, user_type, user_status, createtime FROM user ORDER BY id DESC LIMIT ? OFFSET ? `, [pagesizeFiler, From]) || [];

    const RS: any = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;
  
    return RS;
  }

  export async function getUserLogs(email: string, pageid: number, pagesize: number) {
    const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
    const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
    const From = pageidFiler * pagesizeFiler;
    console.log("pageidFiler", pageidFiler)
    console.log("pagesizeFiler", pagesizeFiler)

    const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from userlog where email = ? ", [email]);
    const RecordsTotal: number = Records ? Records.NUM : 0;

    const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * FROM userlog WHERE email = ? ORDER BY id DESC LIMIT ? OFFSET ? `, [email, pagesizeFiler, From]) || [];

    const RS: any = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;
  
    return RS;
  }

  export async function getUserLogsAll(pageid: number, pagesize: number) {
    const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
    const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
    const From = pageidFiler * pagesizeFiler;
    console.log("pageidFiler", pageidFiler)
    console.log("pagesizeFiler", pagesizeFiler)

    const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from userlog");
    const RecordsTotal: number = Records ? Records.NUM : 0;

    const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * FROM userlog ORDER BY id DESC LIMIT ? OFFSET ? `, [pagesizeFiler, From]) || [];

    const RS: any = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;
  
    return RS;
  }

  export function urlToSettings (url: string) {
    const obj = new URL(url)
    const protocol = obj.protocol.replace(':', '')
    const host = obj.hostname
    const port = obj.port ? parseInt(obj.port) : protocol === 'https' ? 443 : 80
    
    return { protocol, host, port }
  }

  export async function updateUserImageFavorite(token: string, data: any) {
    console.log("data", data)
    const checkUserTokenData: any = await checkUserToken(token);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user' && data && data.id && data.status != null)) {
      console.log("checkUserTokenData", checkUserTokenData)
      if(data.status == '1') {
        const updateSetting = db.prepare('update userimages set favorite = favorite + 1 where id = ?');
        updateSetting.run(data.id);
        updateSetting.finalize();
      }
      else {
        const updateSetting = db.prepare('update userimages set favorite = favorite - 1 where id = ?');
        updateSetting.run(data.id);
        updateSetting.finalize();
      }
      const insertUser = db.prepare('INSERT OR IGNORE INTO userimagefavorite (userId, imageId, status, createtime) VALUES (?, ?, ?, ?)');
      insertUser.run(checkUserTokenData.data.id, data.id, data.status, Date.now());
      insertUser.finalize();
      return {"status":"ok", "msg":"Favorite successful"}
    }
    else {
      return {"status":"error", "msg":"Token is invalid in changeUserDetail"}
    }
  }

  export async function updateUserVideoFavorite(token: string, data: any) {
    console.log("data", data)
    const checkUserTokenData: any = await checkUserToken(token);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user' && data && data.id && data.status != null)) {
      console.log("checkUserTokenData", checkUserTokenData)
      if(data.status == '1') {
        const updateSetting = db.prepare('update uservideos set favorite = favorite + 1 where id = ?');
        updateSetting.run(data.id);
        updateSetting.finalize();
      }
      else {
        const updateSetting = db.prepare('update uservideos set favorite = favorite - 1 where id = ?');
        updateSetting.run(data.id);
        updateSetting.finalize();
      }
      const insertUser = db.prepare('INSERT OR IGNORE INTO uservideofavorite (userId, videoId, status, createtime) VALUES (?, ?, ?, ?)');
      insertUser.run(checkUserTokenData.data.id, data.id, data.status, Date.now());
      insertUser.finalize();
      return {"status":"ok", "msg":"Favorite successful"}
    }
    else {
      return {"status":"error", "msg":"Token is invalid in changeUserDetail"}
    }
  }