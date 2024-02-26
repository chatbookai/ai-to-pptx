import { Request, Response } from 'express';
import axios from 'axios'
import * as fs from 'fs'
import { DataDir } from './const'

import path from 'path'
import { db, getDbRecord, getDbRecordALL } from './db'
import { timestampToDate, isFile } from './utils'
import sharp from 'sharp'

type SqliteQueryFunction = (sql: string, params?: any[]) => Promise<any[]>;

const backEndApi = "https://openapi.seaart.ai"
const SEAART_CLIENT_ID = process.env.SEAART_CLIENT_ID
const SEAART_SECRET_KEY = process.env.SEAART_SECRET_KEY

interface SeaArt {
  model: string
  prompt: string
  negativePrompt: string
  width: number
  height: number
  steps: number
  CFGScale: number
  numberOfImages: number
  style: string
  outpuFormat: string
  seed: number | string
}

export async function generateImageSeaArt(checkUserTokenData: any, data: SeaArt) {

  const SimpleData = {
    "category": 4,
    "art_model_no": "",
    "prompt": "A captivating portrait of a Chinese girl radiating grace and elegance. The painting captures her intriguing beauty in intricate detail, showcasing a serene aura that captivates the viewer's gaze. The girl's delicate features are adorned with traditional Chinese attire, further emphasizing her cultural heritage",
    "width": 768,
    "height": 768,
    "num": 1,
    "restore_faces": false,
    "loras": [
    ]
  }
  const getTokenSeaArtData = await getTokenSeaArt();
  const access_token = getTokenSeaArtData.data.access_token;
  const POSTDATA: any = {}
  POSTDATA['width'] = 768
  POSTDATA['height'] = 1024
  POSTDATA['num'] = 1
  POSTDATA['category'] = 2
  POSTDATA['art_model_no'] = "9d2672fc7e8cdd0e83260b5ef189c232"
  POSTDATA['restore_faces'] = false
  POSTDATA['loras'] = []
  POSTDATA['prompt'] = data.prompt
  POSTDATA['negative_prompt'] = data.negativePrompt
  POSTDATA['cfg_scale'] = 5
  POSTDATA['steps'] = 40
  POSTDATA['sample_name'] = ''
  POSTDATA['seed'] = -1
  POSTDATA['num'] = 1
  
  console.log("POSTDATA", POSTDATA)

  try {
    const res = await axios.post(backEndApi + "/v1/api/task/text-to-img", JSON.stringify(POSTDATA), {
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${access_token}`,
        },
      });
    if(res.status == 200 && res.data && res.data.data && res.data.data.id) {
        const cost_api = 0.005   
        const cost_usd = 0.01  
        const cost_xwe = 0    
        const orderTX = ''
        const orderId = res.data.data.id
        try {
            const insertSetting = db.prepare('INSERT INTO userimages (userId, email, model, `prompt`, negative_prompt, steps, seed, style, filename, data, `date`, createtime, cost_usd, cost_xwe, cost_api, orderId, orderTX, source ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            insertSetting.run(checkUserTokenData.data.id, checkUserTokenData.data.email, data.model, data.prompt, data.negativePrompt, data.steps, 0, "", orderId, JSON.stringify(POSTDATA), timestampToDate(Date.now()/1000), Date.now(), cost_usd, cost_xwe, cost_api, orderId, orderTX, 'seaart.ai');
            insertSetting.finalize();
            const FileName = path.join(DataDir, "/image/"+ orderId + ".png");
            while (!isFile(FileName) && orderId != undefined && orderId != null && orderId != '') {
                await sleep(3500);
                await checkImageProcessSeaArt([orderId])
            }
            return orderId;
        }
        catch(error: any) {
          console.log("generateImageSeaArt insertSetting Error", error.message)
          return null;
        }
    }
    else {
        console.log("generateImageSeaArt insertSetting Error", res.data)
        return res.data.status.msg;
    }
  }
  catch(error: any) {
    console.log("generateImageSeaArt Error", error.message)
    return null;
  }
  
}

export async function checkImageProcessSeaArt(ids: string[]) {
    const getTokenSeaArtData = await getTokenSeaArt();
    const access_token = getTokenSeaArtData.data.access_token;
    try {
      const res = await axios.post(backEndApi + "/v1/api/task/batch-progress", JSON.stringify({task_ids: ids}), {
          headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${access_token}`,
          },
        }).then(res => res.data);
      console.log("res.data.items", ids)
      if(res.status.code == 10000 && res.data.items) {
        res.data.items.map((Item: any, Index: number) => {
            const task_id = Item.task_id
            const type = Item.type
            const process = Item.process
            const image = Item.image
            const images = Item.images
            const status = Item.status
            const status_desc = Item.status_desc
            if(status_desc == "finish" && images) {
                console.log("images", images)
                images.map((ImageItem: any, ImageItemIndex: number)=>{
                    console.log("ImageItem", ImageItem.url)
                    if(ImageItem.url && ImageItem.url != "")  {
                        downloadAndConvert(ImageItem.url, task_id)
                        return true;
                    }
                })
            }
            else {
                console.log("res.data.items Index", Index)
                console.log("res.data.items image", image, status_desc, "process", process) 
            }           
        })
        //console.log("res.data.items", res.data.items)
        return false;
      }
      else {
        return false;
      }
    }
    catch(error: any) {
      console.log("checkImageProcessSeaArt Error", error.message)
      return false;
    }
  }

export function Base64ToImg(Base64IMG: string, model: string) {
    const decodedImg = Buffer.from(Base64IMG, 'base64');
    const uniqueSuffix = model + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9);
    const FileName = DataDir + "/image/" +uniqueSuffix + '.png';
    fs.writeFileSync(FileName, decodedImg);
    return uniqueSuffix;
}

export async function downloadAndConvert(webpUrl: string, filename: string) {
    try {
        const webpFilePath = DataDir + "/image/" +filename + '.webp';
        const pngFilePath = DataDir + "/image/" +filename + '.png';
        fetch(webpUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => {
                const imageBuffer = Buffer.from(arrayBuffer);
                fs.writeFileSync(webpFilePath, imageBuffer);
                if (fs.existsSync(webpFilePath)) {
                    sharp(webpFilePath)
                        .png()
                        .toFile(pngFilePath)
                        .then(() => {
                            console.log('Conversion successful!');
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                } else {
                    console.error('Failed to save WEBP file:', webpFilePath);
                }
            })
            .catch(error => {
                console.error('Error fetching image:', error);
            });
    } 
    catch (error) {
      console.error('Error:', error);
    }
}

export async function getUserImagesSeaArt(userId: string, pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  console.log("pageidFiler", pageidFiler)
  console.log("pagesizeFiler", pagesizeFiler)

  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from userimages where userId = ? ", [userId]);
  const RecordsTotal: number = Records ? Records.NUM : 0;

  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)('SELECT * FROM userimages where userId = ? ORDER BY id DESC LIMIT ? OFFSET ? ', [userId, pagesizeFiler, From]) || [];

  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getUserImagesAll(pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  console.log("pageidFiler", pageidFiler)
  console.log("pagesizeFiler", pagesizeFiler)

  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from userimages where 1=1 ");
  const RecordsTotal: number = Records ? Records.NUM : 0;

  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)('SELECT * FROM userimages where 1=1 ORDER BY id DESC LIMIT ? OFFSET ? ', [pagesizeFiler, From]) || [];

  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getTokenSeaArt() {
    const POSTDATA = { client_id: SEAART_CLIENT_ID, secret: SEAART_SECRET_KEY}
    const res = await axios.post(backEndApi + "/v1/api/auth/token", JSON.stringify(POSTDATA), {
        headers: {
        'content-type': 'application/json',
        },
    }).then(res => res.data);
    return res;  
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function outputImageSeaArt(res: Response, file: string) {
    try {
      const FileName = path.join(DataDir, "/image/"+ file + ".png");
      while (!isFile(FileName) && file != undefined && file != null && file != '') {
        await sleep(3500); // 暂停 2 秒
        await checkImageProcessSeaArt([file])
      }
      if(isFile(FileName))   {
        const readStream = fs.createReadStream(FileName);
        res.setHeader('Content-Type', 'image/png');
        readStream.pipe(res);
        console.log("outputImageSeaArt FileName Exist: ", FileName)
      }
      else {
        res.status(200).json({ error: 'File not exist' })
      }
    } 
    catch (error) {
        console.error('outputImage Error:', error);
        res.status(200).json({ error: 'File not exist' })
    }
  }



















