
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





