import crypto from 'crypto';

export function GetIV() {
    const iv = crypto.randomBytes(16);

    return iv;
}

export function calculateAES256GCMKey(iv: string, uuid: string) {
    const jwkString = "UUID";
    const key = calculateSHA256(iv + uuid + jwkString);

    return key;
}


export function calculateSHA256(input: string) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  
  return hash.digest('hex');
}

export function EncryptEmailAES256GCMV1(text: string, key: string) {
    const keyHash = calculateSHA256(key)
    const iv = GetIV();
    const cipher = crypto.createCipheriv('aes-256-gcm', keyHash.slice(0, 32), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();

    return iv.toString('hex') + encrypted + tag.toString('hex');
}

export function DecryptEmailAES256GCMV1(encrypted: string, key: string) {
    try {
        const iv = encrypted.slice(0, 32);
        const tag = encrypted.slice(-32);
        const encryptedText = encrypted.slice(32, -32);
        const keyHash = calculateSHA256(key)
        const decipher = crypto.createDecipheriv('aes-256-gcm', keyHash.slice(0, 32), Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
    
        return decrypted;
    }
    catch(error: any) {
        
        return ''
    }
}

export function EncryptEmailAddressAES256CBC_NOTUSE(text: string, key: string) {
    const iv = Buffer.from(key.slice(0, 16), 'utf8');
    const cipher = crypto.createCipheriv('aes-256-cbc', key.slice(0, 32), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    console.log("encrypted", encrypted)

    return encrypted;
}

export function DecryptEmailAddressAES256CBC_NOTUSE(encrypted: string, key: string) {
    try {
        const iv = Buffer.from(encrypted.slice(0, 32), 'hex');
        const tag = encrypted.slice(-64);
        const encryptedText = encrypted.slice(32, -64);
    
        const hmac = crypto.createHmac('sha256', key.slice(32, 64));
        hmac.update(encryptedText);
        const calculatedTag = hmac.digest('hex');
    
        if (calculatedTag !== tag) {
            return ''
        }
    
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.slice(0, 32), 'utf8'), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
    
        return decrypted;
    }
    catch(error: any) {

        return ''
    }
}
