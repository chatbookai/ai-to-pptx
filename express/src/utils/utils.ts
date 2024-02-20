import * as fs from 'fs'
import multer from 'multer'
import path from 'path'
import * as crypto from 'crypto'
import sqlite3 from 'sqlite3';
import validator from 'validator';
import { promisify } from 'util';
import { DataDir, CONDENSE_TEMPLATE_INIT, QA_TEMPLATE_INIT } from './const';

import { db, getDbRecord, getDbRecordALL } from './db'

type SqliteQueryFunction = (sql: string, params?: any[]) => Promise<any[]>;


export function enableDir(directoryPath: string): void {
  try {
    fs.accessSync(directoryPath, fs.constants.F_OK);
  } 
  catch (err: any) {
    try {
      fs.mkdirSync(directoryPath, { recursive: true });
    } 
    catch (err: any) {
      log(`Error creating directory ${directoryPath}: ${err.message}`);
      throw err;
    }
  }
}

export async function getLLMSSetting(knowledgeId: number | string) {
  const knowledgeIdFilter = filterString(knowledgeId)
  
  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT name,content from setting where type='openaisetting' and knowledgeId = ? `, [knowledgeIdFilter]) as any[];
  const OpenAISetting: any = {}
  if(RecordsAll)  {
    RecordsAll.map((Item: any)=>{
      OpenAISetting[Item.name] = Item.content
    })
  }

  return OpenAISetting
}

export async function setOpenAISetting(Params: any) {
  const knowledgeIdFilter = filterString(Params.knowledgeId)
  const userIdFilter = filterString(Params.userId)
  try {
    const insertSetting = db.prepare('INSERT OR REPLACE INTO setting (name, content, type, knowledgeId, userId) VALUES (?, ?, ?, ?, ?)');
    insertSetting.run('OPENAI_API_BASE', Params.OPENAI_API_BASE, 'openaisetting', knowledgeIdFilter, userIdFilter);
    insertSetting.run('OPENAI_API_KEY', Params.OPENAI_API_KEY, 'openaisetting', knowledgeIdFilter, userIdFilter);
    insertSetting.run('Temperature', Params.Temperature, 'openaisetting', knowledgeIdFilter, userIdFilter);
    insertSetting.run('ModelName', Params.ModelName, 'openaisetting', knowledgeIdFilter, userIdFilter);
    insertSetting.finalize();
  }
  catch (error: any) {
    log('Error setOpenAISetting:', error.message);
  }

  return {"status":"ok", "msg":"Updated Success"}
}

export async function getTemplate(knowledgeId: number | string, userId: string) {
  const knowledgeIdFilter = filterString(knowledgeId)
  const userIdFilter = Number(userId)
  
  const SettingRS: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT name,content from setting where type='TEMPLATE' and knowledgeId = ? and userId = ? `, [knowledgeIdFilter, userIdFilter]) as any[];
  
  const Template: any = {}
  if(SettingRS)  {
    SettingRS.map((Item: any)=>{
      Template[Item.name.replace("_" + String(knowledgeIdFilter),"")] = Item.content
    })
  }

  return Template
}

export async function setTemplate(Params: any) {
  try{
    const knowledgeIdFilter = Number(Params.knowledgeId)
    const userIdFilter = Params.userId
    const Templatename = "TEMPLATE"
    const insertSetting = db.prepare('INSERT OR REPLACE INTO setting (name, content, type, knowledgeId, userId) VALUES (?, ?, ?, ?, ?)');
    insertSetting.run('CONDENSE_TEMPLATE', Params.CONDENSE_TEMPLATE, Templatename, knowledgeIdFilter, userIdFilter);
    insertSetting.run('QA_TEMPLATE', Params.QA_TEMPLATE, Templatename, knowledgeIdFilter, userIdFilter);
    insertSetting.finalize();
  }
  catch (error: any) {
    log('Error setOpenAISetting:', error.message);
  }

  return {"status":"ok", "msg":"Updated Success"}
}

export async function addKnowledge(Params: any) {
  try{
    console.log("ParamsParamsParamsParamsParams", Params)
    const userIdFilter = Params.userId
    Params.name = filterString(Params.name)
    Params.summary = filterString(Params.summary)
    
    const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT id from knowledge where name = ? and userId = ?", [Params.name, userIdFilter]);
    const RecordId: number = Records ? Records.id : 0;

    console.log("RecordId", RecordId, Params.userId)
    if(RecordId > 0) {
      Params.id = RecordId
      setKnowledge(Params)
    }
    else {
      const insertSetting = db.prepare('INSERT OR REPLACE INTO knowledge (name, summary, timestamp, userId) VALUES (?, ?, ?, ?)');
      insertSetting.run(Params.name, Params.summary, Date.now(), userIdFilter);

      insertSetting.run(Params.name, Params.summary, Date.now(), userIdFilter, function(err: any) {
        if (err) {
          console.error(err.message);

          return;
        }

        //@ts-ignore
        const lastInsertId = this.lastID;
        console.log('Last inserted ID:', lastInsertId);
        insertSetting.finalize();
        if(lastInsertId) {
          const TemplateInfo = {knowledgeId: lastInsertId, CONDENSE_TEMPLATE: CONDENSE_TEMPLATE_INIT, QA_TEMPLATE: QA_TEMPLATE_INIT, userId: userIdFilter}
          setTemplate(TemplateInfo)
        }

      });
    }
  }
  catch (error: any) {
    log('Error setOpenAISetting:', error.message);
  }

  return {"status":"ok", "msg":"Updated Success"}
}


export async function setKnowledge(Params: any) {
  try{
    Params.id = Number(Params.id)
    Params.name = filterString(Params.name)
    Params.summary = filterString(Params.summary)
    const updateSetting = db.prepare('update knowledge set name = ?, summary = ?, timestamp = ? where id = ?');
    updateSetting.run(Params.name, Params.summary, Date.now(), Params.id);
    updateSetting.finalize();
  }
  catch (error: any) {
    log('Error setOpenAISetting:', error.message);
  }

  return {"status":"ok", "msg":"Updated Success"}
}

export function uploadfiles() {
  const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, DataDir + '/uploadfiles/'); // 设置上传文件保存的目录
    },
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const FileNameNew = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase();
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
      log("uploadfiles FileNameNew", FileNameNew)
    },
  });
  const upload = multer({ storage: storage });

  return upload
}

export function uploadImageForVideo() {
  const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, DataDir + '/imageforvideo/'); // 设置上传文件保存的目录
    },
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const FileNameNew = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase();
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
      log("uploadImageForVideo FileNameNew", FileNameNew)
    },
  });
  const upload = multer({ storage: storage });

  return upload
}

export function uploadImageForImageGenerateImage() {
  const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, DataDir + '/imageforimage/'); // 设置上传文件保存的目录
    },
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const FileNameNew = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase();
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
      log("uploadImageForImageGenerateImage FileNameNew", FileNameNew)
    },
  });
  const upload = multer({ storage: storage });

  return upload
}

export async function uploadfilesInsertIntoDb(files: any[], knowledgeId: number | string, userId: string) {
  //const originalName = Buffer.from(files[0].originalname, 'hex').toString('utf8');
  //log("originalName", files[0].originalname)
  const filesInfo = files.map((file: any) => {
    const filePath = path.join(DataDir, 'uploadfiles', file.filename);
    const fileHash = calculateFileHashSync(filePath);

    return {
      originalName: file.originalname,
      newName: file.filename,
      hash: fileHash,
    };
  });
  const insertFiles = db.prepare('INSERT OR IGNORE INTO files (knowledgeId, suffixName, newName, originalName, hash, timestamp, userId) VALUES (?,?,?,?,?,?,?)');
  filesInfo.map((Item: any)=>{
    const suffixName = path.extname(Item.originalName).toLowerCase();
    insertFiles.run(knowledgeId, suffixName, Item.newName, Item.originalName, Item.hash, Date.now(), Number(userId));
  })
  insertFiles.finalize();
}

export async function InsertFilesDb(knowledgeId: number | string, originalFilename: string, FileNameNew: string, FileHash: string, userId: string) {
  console.log("originalFilenameoriginalFilenameoriginalFilename", originalFilename)
  const insertFiles = db.prepare('INSERT OR IGNORE INTO files (knowledgeId, suffixName, newName, originalName, hash, timestamp, userId) VALUES (?,?,?,?,?,?,?)');
  const suffixName = path.extname(originalFilename).toLowerCase();
  insertFiles.run(knowledgeId, suffixName, FileNameNew, originalFilename, FileHash, Date.now(), Number(userId));
  insertFiles.finalize();
}

export async function getFilesPage(pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  
  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from files");
  const RecordsTotal: number = Records ? Records.NUM : 0;  
  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from files where 1=1 order by status desc, timestamp desc limit ? OFFSET ? `, [pagesizeFiler, From]) as any[];
  let RSDATA: any[] = []
  if(RecordsAll != undefined) {
    RSDATA = await Promise.all(
      RecordsAll.map(async (Item: any)=>{
          let ItemStatus = "Ready To Parse"
          switch(Item.status) {
            case 1:
              ItemStatus = 'Finished'
              break;
            case -1:
              ItemStatus = 'File Not Exist'
              break;
          }

          return {...Item, status:ItemStatus, timestamp: formatDateFromTimestamp(Item.timestamp)}
        })
    );
    
    //log("getFilesPage", RSDATA)
  }
  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RSDATA.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getFilesKnowledgeId(knowledgeId: number | string, pageid: number, pagesize: number) {
  const KnowledgeIdFiler = Number(knowledgeId) < 0 ? 0 : Number(knowledgeId);
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  
  
  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from files where knowledgeId = ?", [KnowledgeIdFiler]);
  const RecordsTotal: number = Records ? Records.NUM : 0;  
  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from files where knowledgeId = ? order by status desc, timestamp desc limit ? OFFSET ? `, [KnowledgeIdFiler, pagesizeFiler, From]) as any[];

  let RSDATA = []
  if(RecordsAll != undefined) {
    RSDATA = await Promise.all(
      RecordsAll.map(async (Item)=>{
          let ItemStatus = "Ready To Parse"
          switch(Item.status) {
            case 1:
              ItemStatus = 'Finished'
              break;
            case -1:
              ItemStatus = 'File Not Exist'
              break;
          }

          return {...Item, status:ItemStatus, timestamp: formatDateFromTimestamp(Item.timestamp)}
        })
    );
  }
  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RSDATA.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getFilesNotParsed() {
  
  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from files where status = '0' order by timestamp asc limit 10 `) as any[];

  return RecordsAll;
}

export async function getChatLogByKnowledgeIdAndUserId(knowledgeId: number | string, userId: number, pageid: number, pagesize: number) {
  const KnowledgeIdFiler = filterString(knowledgeId);
  const userIdFiler = Number(userId) < 0 ? 0 : Number(userId) || 1;
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;

  
  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from chatlog where knowledgeId = ? and userId = ?", [KnowledgeIdFiler, userIdFiler]);
  const RecordsTotal: number = Records ? Records.NUM : 0;  
  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from chatlog where knowledgeId = ? and userId = ? order by id desc limit ? OFFSET ? `, [KnowledgeIdFiler, userIdFiler, pagesizeFiler, From]) as any[];

  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getLogsPage(pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;

  
  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from logs ");
  const RecordsTotal: number = Records ? Records.NUM : 0;  
  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from logs order by id desc limit ? OFFSET ? `, [pagesizeFiler, From]) as any[];
  
  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getKnowledgePage(pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  console.log("pageidFiler", pageidFiler)
  console.log("pagesizeFiler", pagesizeFiler)

  
  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from knowledge where userId = ? ");
  const RecordsTotal: number = Records ? Records.NUM : 0;  
  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from knowledge order by id desc limit ? OFFSET ? `, [pagesizeFiler, From]) as any[];
  
  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export function timestampToDate(timestamp: number | string) {
  const date = new Date(Number(timestamp) * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function log(Action1: string | any, Action2: string | any='', Action3: string | any='', Action4: string | any='', Action5: string | any='', Action6: string | any='', Action7: string | any='', Action8: string | any='', Action9: string | any='', Action10: string | any='') {
  const userId = 0
  const currentDate = new Date();
  const currentDateTime = currentDate.toLocaleString();
  const content = JSON.stringify(Action1) +" "+ JSON.stringify(Action2) +" "+ JSON.stringify(Action3) +" "+ JSON.stringify(Action4) +" "+ JSON.stringify(Action5) +" "+ JSON.stringify(Action6) +" "+ JSON.stringify(Action7) +" "+ JSON.stringify(Action8) +" "+ JSON.stringify(Action9) +" "+ JSON.stringify(Action10);
  const insertStat = db.prepare('INSERT OR REPLACE INTO logs (datetime, content, knowledgeId, userId) VALUES (? ,? ,? ,?)');
  insertStat.run(currentDateTime, content, 0, userId);
  insertStat.finalize();
  console.log(userId, Action1, Action2, Action3, Action4, Action5, Action6, Action7, Action8, Action9, Action10)
}

export async function deleteLog() {
  
  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT MAX(id) AS NUM FROM logs");
  const MaxId: number = Records ? Records.NUM : 0;
  if(MaxId > 1000) {
    const DeleteId = MaxId - 1000;
    const DeleteLog = db.prepare("delete from logs where id < ?");
    DeleteLog.run(DeleteId);
    DeleteLog.finalize();
  }
}

export async function GetSetting(Name: string, knowledgeId: number | string, userId: number) {
  
  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT content FROM setting where name = ? and knowledgeId = ? and userId = ? ", [Name, knowledgeId, userId]);  
  return Records ? Records.content : '';
}

export function calculateFileHashSync(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(fileContent);

    return hash.digest('hex');
  } 
  catch (error: any) {
    throw error;
  }
}

export function readFile(Dir: string, FileName: string, Mark: string, OpenFormat: any) {
  const filePath = DataDir + '/' + Dir + '/' + FileName;
  if(isFile(filePath)) {
    log("filePath", filePath)
    const data = fs.readFileSync(filePath, OpenFormat);

    return data;
  }
  else {
    log("[" + Mark + "] Error read file:", filePath);

    return null;
  }
}

export function writeFile(Dir: string, FileName: string, FileContent: string, Mark: string) {
  const directoryPath = DataDir + '/' + Dir;
  enableDir(directoryPath)
  const TxFilePath = directoryPath + "/" + FileName
  try {
    fs.writeFileSync(TxFilePath, FileContent);

    return true;
  } 
  catch (err) {
    log("[" + Mark + "] Error writing to file:", err);

    return false;
  }
}

export function filterString(input: number | string) {
  log("filterString input:", input)
  if (typeof input === 'number') {

    return input;
  } 
  else if (typeof input === 'string') {

    return input;
  } else {

    return input;
  }
}

export function copyFileSync(source: string, destination: string) {
  try {
    const content = fs.readFileSync(source);
    fs.writeFileSync(destination, content);
    log('0', 'File copied successfully!');

    return true;
  } 
  catch (error: any) {
    log('0', 'Error copying file:', error);

    return false;
  }
}

export function isFile(filePath: string) {
  try {
    const stats = fs.statSync(filePath);
    if (stats.isFile() && stats.size > 0) {

      return true;
    } else {

      return false;
    }
  } 
  catch (err) {

    return false;
  }
}

export function formatDateFromTimestamp(timestamp: number | string) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

export const isEmailValid = (email: string): boolean => {
  return validator.isEmail(email);
};

export async function wholeSiteStatics() {
  const NewUserPerDayData: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT strftime('%Y-%m-%d', datetime(createtime / 1000, 'unixepoch')) AS date, count(*) AS NUM from user group by date order by date asc`) as any[];
  const NewUserPerDay = NewUserPerDayData.map(Item => Item.NUM)

  const NewImagesPerDayData: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT strftime('%Y-%m-%d', datetime(createtime / 1000, 'unixepoch')) AS date, count(*) AS NUM from userimages group by date order by date asc`) as any[];
  const NewImagesPerDay = NewImagesPerDayData.map(Item => Item.NUM)

  const NewFilesPerDayData: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT strftime('%Y-%m-%d', datetime(timestamp / 1000, 'unixepoch')) AS date, count(*) AS NUM from files group by date order by date asc`) as any[];
  const NewFilesPerDay = NewFilesPerDayData.map(Item => Item.NUM)

  const NewActivitesPerDayData: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT strftime('%Y-%m-%d', datetime(timestamp / 1000, 'unixepoch')) AS date, count(*) AS NUM from chatlog group by date order by date asc`) as any[];
  const NewActivitesPerDay = NewActivitesPerDayData.map(Item => Item.NUM)

  const DateListData: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT distinct strftime('%Y-%m-%d', datetime(timestamp / 1000, 'unixepoch')) AS date from chatlog order by date asc`) as any[];
  const DateList = DateListData.map(Item => Item.date)

  const Records1: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from userimages");
  const TotalImages: number = Records1 ? Records1.NUM : 0;

  const Records2: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from chatlog");
  const TotalActivites: number = Records2 ? Records2.NUM : 0;

  const Records3: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from user");
  const TotalUsers: number = Records3 ? Records3.NUM : 0;

  const Records4: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from files");
  const TotalFiles: number = Records4 ? Records4.NUM : 0;

  const Records5: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from knowledge");
  const TotalKnowledges: number = Records5 ? Records5.NUM : 0;
  
  return {NewUserPerDay, NewImagesPerDay, NewFilesPerDay, NewActivitesPerDay, DateList, TotalImages, TotalActivites, TotalUsers, TotalFiles, TotalKnowledges}
}

export async function getAllImages(userId: string | undefined, pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  console.log("pageidFiler", pageidFiler)
  console.log("pagesizeFiler", pagesizeFiler)

  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from userimages where 1=1 ");
  const RecordsTotal: number = Records ? Records.NUM : 0;

  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)("SELECT * FROM userimages where 1=1 ORDER BY id DESC LIMIT ? OFFSET ? ", [pagesizeFiler, From]) || [];

  const RecordsIdList: string[] = RecordsAll.map(element => element.id);

  //Get Favorite Data
  let Favorite: any = {}
  if(userId)  {
    const RecordsFavorite = await (getDbRecordALL as SqliteQueryFunction)("SELECT * FROM userimagefavorite WHERE imageId IN (" + RecordsIdList.map(() => "?").join(",") + ") and userId = ? and status = 1 order by id asc", [...RecordsIdList, userId]) || [];
    RecordsFavorite.map((Item: any)=>{
      Favorite[Item.imageId] = 1
    })
  }

  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['favorite'] = Favorite
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export function filterNegativePrompt(Prompt: string) {
  const PromptNew = Prompt + ", ugly, poorly designed, amateur, bad proportions, direct sunlight, low quality, disfigured hands, poorly drawn face, out of frame, bad anatomy, signature, low contrast, overexposed, nsfw, weapon, blood, guro, without cloth, disturbing imagery, sexual violence, inappropriate attire, blurry, unfocused, unpleasant, unintelligible, offensive, distorted, unoriginal, uninspired, poor composition, boring, inconsistent style, low resolution, irrelevant"
  return removeDuplicates(PromptNew)
}

export function removeDuplicates(words: string): string {
  const wordList = words.split(',');
  const uniqueWords: string[] = [];
  for (const word of wordList) {
    if (!uniqueWords.includes(word.trim())) {
      uniqueWords.push(word.trim());
    }
  }
  return uniqueWords.join(',');
}
