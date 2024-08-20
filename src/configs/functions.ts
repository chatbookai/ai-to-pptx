import { TxRecordType } from '@/types/apps/Chivesweave'
import authConfig from '@/configs/auth'

export function formatHash(inputString: string, spliceSize: number): string {
  if(inputString == undefined) {
    return '';
  }
  if(inputString == "") {
    return '';
  }

  if (inputString.length <= spliceSize * 2) {

    return inputString; 
  }
  const firstPart = inputString.substring(0, spliceSize);
  const lastPart = inputString.substring(inputString.length - spliceSize);
  
  return `${firstPart} ... ${lastPart}`;

}

export function formatAR(dividend: number, precision: number) {
  if(dividend == 0) {

    return '0';
  }
  const divisor = 1000000000000;
  const result = (dividend / divisor).toFixed(precision);
  
  return result;
}

export function formatXWE(dividend: number, precision: number) {
  if(dividend == 0) {

    return '0';
  }
  const divisor = 1000000000000;
  const result = (dividend / divisor).toFixed(precision);
  
  return result;
}

export function formatToken(dividend: number, precision: number) {
  if(dividend == null || dividend == undefined) return 
  if(dividend == 0) {

    return '0';
  }
  let result = 0
  if(Number(precision)<=0)  {
    result = dividend;
  }
  else  {
    const divisor = Math.pow(10, precision);
    result = (dividend / divisor);
  }

  return result;
}

export function formatXWEAddress(dividend: number, precision: number) {
  const divisor = 10000;
  const result = (dividend / divisor).toFixed(precision);
  
  return result;
}

export function formatSecondToMinute(miningTime: number): string {
  let timeMemo = '';
  if (miningTime < 60) {
    timeMemo =  `${Math.floor(miningTime)} seconds`;
  } else if (miningTime < 3600) {
    const minutes = Math.floor(miningTime / 60);
    timeMemo =  `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (miningTime < 86400) {
    const hours = Math.floor(miningTime / 3600);
    timeMemo =  `about ${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return timeMemo;
}

export function formatTimestampDateTime(timestamp: number): string {
  const date = String(timestamp).length == 10 ? new Date(timestamp * 1000) : new Date(timestamp)
  if(timestamp == undefined) return ""

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

export function formatTimestampMemo(timestamp: number): string {
  const date = String(timestamp).length == 10 ? new Date(timestamp * 1000) : new Date(timestamp)
  const currentDate = new Date();
  const timeDifference = (currentDate.getTime() - date.getTime()) / 1000;
  if(timestamp == undefined) return ""
  let timeMemo = '';
  if (timeDifference < 60) {
    timeMemo =  ` (${Math.floor(timeDifference)} seconds)`;
  } else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60);
    timeMemo =  ` (${minutes} minute${minutes > 1 ? "s" : ""})`;
  } else if (timeDifference < 86400) {
    const hours = Math.floor(timeDifference / 3600);
    timeMemo =  ` (about ${hours} hour${hours > 1 ? "s" : ""})`;
  } else {
    timeMemo =  ``;
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds} ${ampm} ${timeMemo}`;

  return formattedDate;
}

export function formatTimestampAge(timestamp: number): string {
  const date = String(timestamp).length == 10 ? new Date(timestamp * 1000) : new Date(timestamp)
  console.log("date", date)
  const currentDate = new Date();
  const timeDifference = (currentDate.getTime() - date.getTime()) / 1000;
  if(timestamp == undefined) return ""
  let timeMemo = '';
  if (timeDifference <= 1) {
    timeMemo =  `1 second ago`;

    return timeMemo
  } 
  else if (timeDifference < 60) {
    timeMemo =  `${Math.floor(timeDifference)} seconds ago`;

    return timeMemo
  } 
  else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60);
    timeMemo =  `${minutes} minute${minutes > 1 ? "s  ago" : ""}`;

    return timeMemo
  } 
  else {

    return formatTimestampMemo(timestamp)
  }
}

export function formatTimestamp(timestamp: number): string {
  if(timestamp == undefined) return ""
  const date = String(timestamp).length == 10 ? new Date(timestamp * 1000) : new Date(timestamp)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

export function formatTimestampLocalTime(timestamp: number): string {
  if(timestamp == undefined) return ""
  
  return formatTimestamp(Number(timestamp) - (new Date().getTimezoneOffset()) * 60 * 1000);
}

export function formatStorageSize(size: number): string {
  if (size < 1024) {

    return `${size} B`;
  } else if (size < 1024 * 1024) {
    const sizeKB = (size / 1024).toFixed(1);

    return `${sizeKB} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    const sizeMB = (size / (1024 * 1024)).toFixed(1);

    return `${sizeMB} MB`;
  } else {
    const sizeGB = (size / (1024 * 1024 * 1024)).toFixed(1);

    return `${sizeGB} GB`;
  }
}

export function getContentTypeAbbreviation(contentType: string): string {
  const contentTypeMap: { [key: string]: string } = {
    'text/plain': 'TEXT',
    'text/html': 'HTML',
    'application/json': 'JSON',
    'application/xml': 'XML',
    'application/zip': 'ZIP',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'image/bmp': 'BMP',
    'application/msword': 'DOC',
    'application/vnd.ms-excel': 'XLS',
    'video/mp4': 'Video',
    'video/webm': 'WEBM',
    'video/ogg': 'OGG',
    'video/mpeg': 'Video',
    'video/quicktime': 'quicktime',
    'video/x-msvideo': 'x-msvideo',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'audio/mpeg': 'Audio',
    'audio/wav': 'Audio',
    'audio/midi': 'Audio',
    'audio/ogg': 'Audio',
    'audio/aac': 'Audio',
    'audio/x-ms-wma': 'Audio',
    'application/x.chivesweave-manifest+json': 'JSON',
    'application/x-msdownload': 'EXE',
    'text/csv':'CSV',
  };
  
  return contentTypeMap[contentType] || contentType; // 未知类型
}

export function parseTxAndGetMemoFileType(TxRecord: TxRecordType): string {
  const FileMap: { [key: string]: string } = {}
  TxRecord.tags.map((Item: { [key: string]: string }) => {
    FileMap[Item.name] = Item.value;
  });
  const FileType = getContentTypeAbbreviation(FileMap['Content-Type']);
  
  return FileType
}

export function parseTxAndGetMemoInfo(TxRecord: TxRecordType): string {
  if(TxRecord.recipient!="" && TxRecord.quantity.winston > 0) {
    
    return formatXWE(TxRecord.quantity.winston, 6) + " " + authConfig.tokenName + " -> " + formatHash(TxRecord.recipient, 6);
  }
  const FileInfo: { [key: string]: string } = {}
  TxRecord.tags.map((Item: { [key: string]: string }) => {
    if(Item.name == "File-Name") {
      FileInfo['name'] = Item.value
      FileInfo['type'] = "File"
    }
    else if(Item.name == "Bundle-Format") {
      FileInfo[Item.name] = Item.value
      FileInfo['type'] = "Bundle"
    }
    else if(Item.name == "Bundle-Version") {
      FileInfo[Item.name] = Item.value
      FileInfo['type'] = "Bundle"
    }
  });
  
  //console.log("FileInfo", FileInfo)
  let result = '';
  switch(FileInfo['type']) {
    case 'File':
      result = FileInfo['name'];
      break;
    case 'Bundle':
      result = "Bundle 2.0.0";
      break;
    default:
      result = "-";
      break;
  }
  
  return result;
}

export function isMobile(): boolean {
  if (typeof window !== 'undefined') {
    const screenWidth = window.innerWidth;
    const userAgent = window.navigator.userAgent;
    if (screenWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      
      return true;
    }
  }
  
  return false;
}

export const ansiRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;





