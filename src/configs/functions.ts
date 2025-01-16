import crypto from 'crypto';

export function GetIV() {
    const iv = crypto.randomBytes(16);

    return iv;
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

export function windowWidth(): number {
  if (typeof window !== 'undefined') {
    const screenWidth = window.innerWidth;
    
    return screenWidth;
  }
  
  return -1;
}

export function EncryptDataAES256GCM(text: string, key: string) {
  const iv = GetIV();
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return { iv: iv.toString('hex'), encrypted, tag: tag.toString('hex') };
}

export function DecryptDataAES256GCM(encrypted: string, iv: string, tag: string, key: string) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
}


