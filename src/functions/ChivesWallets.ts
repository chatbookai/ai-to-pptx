import { PromisePool } from '@supercharge/promise-pool'

import type { JWKInterface } from 'arweave/web/lib/wallet'

import { BalancePlus } from '../functions/AoConnect/AoConnect'

import { customAlphabet } from 'nanoid';

// @ts-ignore
import { v4 } from 'uuid'
import BigNumber from 'bignumber.js'

import Arweave from 'arweave'
import crypto from 'crypto'

// ** Third Party Imports
import axios from 'axios'
import authConfig from '../configs/auth'

const arweave = Arweave.init(urlToSettings(authConfig.backEndApi))

const chivesWallets: string = authConfig.chivesWallets
const chivesCurrentWallet: string = authConfig.chivesCurrentWallet
const chivesWalletNickname: string = authConfig.chivesWalletNickname
const chivesTxStatus: string = authConfig.chivesTxStatus
const chivesLanguage: string = authConfig.chivesLanguage
const chivesContacts: string = authConfig.chivesContacts
const chivesMyAoTokens: string = authConfig.chivesMyAoTokens
const chivesAllAoTokens: string = authConfig.chivesAllAoTokens
const chivesIsSetPassword: string = authConfig.chivesIsSetPassword
const chivesAllAoFaucets: string = authConfig.chivesAllAoFaucets



export function calculateSHA256(input: string) {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    
    return hash.digest('hex');
}

export function EncryptWalletDataAES256GCMV1(text: string, key: string) {
    const hash = crypto.createHash('sha256');
    hash.update(key);
    const keyHash = hash.digest('hex');
    const iv = Buffer.from(keyHash.slice(32, 48), 'utf8');
    const cipher = crypto.createCipheriv('aes-256-gcm', keyHash.slice(0, 32), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();

    return encrypted + tag.toString('hex');
}

export function DecryptWalletDataAES256GCMV1(encrypted: string, key: string) {
    try {
        const tag = encrypted.slice(-32);
        const encryptedText = encrypted.slice(0, -32);
        const hash = crypto.createHash('sha256');
        hash.update(key);
        const keyHash = hash.digest('hex');
        const iv = Buffer.from(keyHash.slice(32, 48), 'utf8');
        const decipher = crypto.createDecipheriv('aes-256-gcm', keyHash.slice(0, 32), iv);
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
    
        return decrypted;
    }
    catch(error: any) {
        
        return ''
    }
}

export function isSetPasswordForWallet() {
    if(typeof window !== 'undefined')  {
        const chivesIsSetPasswordData = window.localStorage.getItem(chivesIsSetPassword)
        if(chivesIsSetPasswordData == null || chivesIsSetPasswordData == '')  {

            return false
        }
        else {

            return true
        }
    }
    
    return true
}

export function setPasswordForWallet(encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const NanoId = getNanoid(32)
        const DecryptWalletData = EncryptWalletDataAES256GCMV1(NanoId as string, encryptWalletDataKey)  
        window.localStorage.setItem(chivesIsSetPassword, DecryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesIsSetPassword]: DecryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', DecryptWalletData);
            });
        }
    }
}

export function checkPasswordForWallet(encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesIsSetPasswordData = window.localStorage.getItem(chivesIsSetPassword)  
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesIsSetPasswordData as string, encryptWalletDataKey)  
        if(DecryptWalletData && DecryptWalletData.length == 32)  {

            return true
        }
        else {
            
            return false
        }
    } 

    return false
}

export function resetPasswordForWallet(oldKey: string, newKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesIsSetPasswordData = window.localStorage.getItem(chivesIsSetPassword)  
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesIsSetPasswordData as string, oldKey)  
        if(DecryptWalletData && DecryptWalletData.length == 32)  {
            
            const EncryptWalletData = EncryptWalletDataAES256GCMV1(DecryptWalletData as string, newKey)  
            window.localStorage.setItem(chivesIsSetPassword, EncryptWalletData)
            if(chrome && chrome.storage && chrome.storage.sync)   {
                chrome.storage.sync.set({ [chivesIsSetPassword]: EncryptWalletData }, () => {
                    console.log('Data saved to chrome.storage:', EncryptWalletData);
                });
            }

            return true
        }
        else {
            
            return false
        }
    }
    else {

        return false
    }
}

export function resetChivesWalletsEncryptedKey(oldKey: string, newKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesWalletsList = window.localStorage.getItem(chivesWallets)  
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, oldKey)    
        const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
        if(walletExists && walletExists.length > 0)  {

            const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(walletExists), newKey)
            window.localStorage.setItem(chivesWallets, EncryptWalletData)
            if(chrome && chrome.storage && chrome.storage.sync)   {
                chrome.storage.sync.set({ [chivesWallets]: EncryptWalletData }, () => {
                    console.log('Data saved to chrome.storage:', EncryptWalletData);
                });
            }

            return true
        }
        else {
            
            return false
        }
    }
    else {

        return false
    }
}

export function resetChivesWalletNickNameEncryptedKey(oldKey: string, newKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesWalletsList = window.localStorage.getItem(chivesWalletNickname)  
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, oldKey)    
        const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
        if(walletExists && walletExists.length > 0)  {

            const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(walletExists), newKey)
            window.localStorage.setItem(chivesWalletNickname, EncryptWalletData)
            if(chrome && chrome.storage && chrome.storage.sync)   {
                chrome.storage.sync.set({ [chivesWalletNickname]: EncryptWalletData }, () => {
                    console.log('Data saved to chrome.storage:', EncryptWalletData);
                });
            }

            return true
        }
        else {
            
            return false
        }
    }
    else {

        return false
    }
}

export function resetChivesContactsEncryptedKey(oldKey: string, newKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesWalletsList = window.localStorage.getItem(chivesContacts)  
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, oldKey)    
        const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        if(walletExists)  {

            const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(walletExists), newKey)
            window.localStorage.setItem(chivesContacts, EncryptWalletData)
            if(chrome && chrome.storage && chrome.storage.sync)   {
                chrome.storage.sync.set({ [chivesContacts]: EncryptWalletData }, () => {
                    console.log('Data saved to chrome.storage:', EncryptWalletData);
                });
            }

            return true
        }
        else {
            
            return false
        }
    }
    else {

        return false
    }
}

export async function generateArWalletJsonData (encryptWalletDataKey: string) {
    
    try {
        const ArWalletJsonData = await arweave.wallets.generate()
            
        const ImportJsonFileWalletAddress = await importWalletJsonFile(ArWalletJsonData, encryptWalletDataKey)

        return ImportJsonFileWalletAddress

    } 
    catch (error) {
        console.log('Error generateArWalletJsonData:', error);
    }
}

export async function jwkToAddress (jwk: any) {

    return await arweave.wallets.jwkToAddress(jwk as any)
}

export async function importWalletJsonFile (wallet: any, encryptWalletDataKey: string) {

    const mnemonicToJwkValue: any = {}
    mnemonicToJwkValue.jwk = wallet

    //Get Wallet Data From LocalStorage
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)  
    const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, encryptWalletDataKey)    
    const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
    
    //Check wallet exist
    const WalletExistFilter = walletExists.filter((item: any)=>item.jwk.n==wallet.n)
    console.log("WalletExistFilter", WalletExistFilter)
    if(WalletExistFilter && WalletExistFilter.length == 0)  {

        //Get Wallet Max Id
        let walletId = 0
        while (walletExists.find((w: any) => +w.id === walletId)) { walletId++ }
        
        //Make walletData
        const walletData: any = {...mnemonicToJwkValue}
        walletData.id ??= walletId
        walletData.uuid ??= v4() as string
        walletData.settings ??= {}
        walletData.state ??= {"hot": true}
    
        //Make Addresss From Jwk
        const key = await arweave.wallets.jwkToAddress(walletData.jwk as any)
        const publicKey = walletData.jwk.n
        walletData.data ??= {}
        walletData.data.arweave = { key, publicKey }            
        
        //Write New Wallet Data to LocalStorage
        walletExists.push(walletData)
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(walletExists), encryptWalletDataKey)
        window.localStorage.setItem(chivesWallets, EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesWallets]: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }
    
        //const addFileToJwkValue = await addFileToJwk('')
        //console.log("addImportDataValue:", addImportDataValue)

        return key
    }
    else {

        return ''
    }

};

export async function addFileToJwk (keyfile: string) {
    try {
        const data = keyfile != null && keyfile != '' && JSON.parse(keyfile) as JWKInterface
		const jwk = data || await arweave.wallets.generate()
		
        return { jwk }
    } catch (error) {
      console.log('Error addFileToJwk:', error);
    }
};

export function urlToSettings (url: string) {
    const obj = new URL(url)
    const protocol = obj.protocol.replace(':', '')
    const host = obj.hostname
    const port = obj.port ? parseInt(obj.port) : protocol === 'https' ? 443 : 80
    
    return { protocol, host, port }
};


export function getAllWallets(encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesWalletsList = window.localStorage.getItem(chivesWallets)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, encryptWalletDataKey)
        const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
        
        return walletExists
    }
};

export function getCurrentWalletAddress(encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const CurrentWalletAddressData = window.localStorage.getItem(chivesCurrentWallet)
        let CurrentWalletAddress = DecryptWalletDataAES256GCMV1(CurrentWalletAddressData as string, encryptWalletDataKey)
        if(CurrentWalletAddress == '') {
            const chivesWalletsList = window.localStorage.getItem(chivesWallets)
            const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, encryptWalletDataKey)
            const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
            if(walletExists && walletExists[0] && walletExists[0].data && walletExists[0].data.arweave && walletExists[0].data.arweave.key) {
                const EncryptWalletData = EncryptWalletDataAES256GCMV1(walletExists[0].data.arweave.key, encryptWalletDataKey)
                window.localStorage.setItem(chivesCurrentWallet, EncryptWalletData)
                if(chrome && chrome.storage && chrome.storage.sync)   {
                    chrome.storage.sync.set({ [chivesCurrentWallet]: EncryptWalletData }, () => {
                        console.log('Data saved to chrome.storage:', EncryptWalletData);
                    });
                }
                CurrentWalletAddress = walletExists[0].data.arweave.key
            }
        }    
        
        return String(CurrentWalletAddress)
    }
};

export function getCurrentWallet(encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const CurrentWalletAddressData = window.localStorage.getItem(chivesCurrentWallet)
        const CurrentWalletAddress = DecryptWalletDataAES256GCMV1(CurrentWalletAddressData as string, encryptWalletDataKey)

        const chivesWalletsList = window.localStorage.getItem(chivesWallets)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, encryptWalletDataKey)
        const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
        let foundWallet = walletExists.find((wallet: any) => wallet.data.arweave.key === CurrentWalletAddress);
        
        if(foundWallet == undefined && walletExists && walletExists[0] && walletExists[0].data && walletExists[0].data.arweave && walletExists[0].data.arweave.key) {
            foundWallet = walletExists[0]
            const EncryptWalletData = EncryptWalletDataAES256GCMV1(walletExists[0].data.arweave.key, encryptWalletDataKey)
            window.localStorage.setItem(chivesCurrentWallet, EncryptWalletData)
            if(chrome && chrome.storage && chrome.storage.sync)   {
                chrome.storage.sync.set({ [chivesCurrentWallet]: EncryptWalletData }, () => {
                    console.log('Data saved to chrome.storage:', EncryptWalletData);
                });
            }
        }

        return foundWallet
    }
};

export function setCurrentWallet(Address: string, encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesWalletsList = window.localStorage.getItem(chivesWallets)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, encryptWalletDataKey)
        const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
        const foundWallet = walletExists.find((wallet: any) => wallet.data.arweave.key === Address);
        
        if(foundWallet && foundWallet.data && foundWallet.data.arweave && foundWallet.data.arweave.key) {
            const EncryptWalletData = EncryptWalletDataAES256GCMV1(Address, encryptWalletDataKey)
            window.localStorage.setItem(chivesCurrentWallet, EncryptWalletData)
            if(chrome && chrome.storage && chrome.storage.sync)   {
                chrome.storage.sync.set({ [chivesCurrentWallet]: EncryptWalletData }, () => {
                    console.log('Data saved to chrome.storage:', EncryptWalletData);
                });
            }
        }

        return true
    }
};

export function setWalletNickname(Address: string, Nickname: string, encryptWalletDataKey: string) {
    if (Address && Address.length === 43 && typeof window !== 'undefined') {
        const chivesWalletNicknameData = window.localStorage.getItem(chivesWalletNickname)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletNicknameData as string, encryptWalletDataKey)
        const chivesWalletNicknameObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        chivesWalletNicknameObject[Address] = Nickname
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(chivesWalletNicknameObject), encryptWalletDataKey)
        window.localStorage.setItem(chivesWalletNickname, EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesWalletNickname]: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }
    }
    
    return true
}

export function getWalletNicknames(encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesWalletNicknameData = window.localStorage.getItem(chivesWalletNickname)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletNicknameData as string, encryptWalletDataKey)
        const chivesWalletNicknameObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        
        return chivesWalletNicknameObject
    }
}

export function getWalletById(WalletId: number, encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesWalletsList = window.localStorage.getItem(chivesWallets)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, encryptWalletDataKey)
        const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
        const foundWallet = walletExists.find((wallet: any) => Number(wallet.id) === WalletId);
        
        return foundWallet
    }
};

export function getWalletByUuid(Uuid: string, encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesWalletsList = window.localStorage.getItem(chivesWallets)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, encryptWalletDataKey)
        const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
        const foundWallet = walletExists.find((wallet: any) => wallet.uuid === Uuid);
        
        return foundWallet
    }
};

export function getWalletByAddress(Address: string, encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesWalletsList = window.localStorage.getItem(chivesWallets)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, encryptWalletDataKey)
        const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
        const foundWallet = walletExists.find((wallet: any) => wallet.data.arweave.key === Address);
        
        return foundWallet
    }
};

export function deleteWalletById(WalletId: number, encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesWalletsList = window.localStorage.getItem(chivesWallets)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, encryptWalletDataKey)
        const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
        const leftWallets = walletExists.filter((wallet: any) => Number(wallet.id) !== WalletId);
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(leftWallets), encryptWalletDataKey)
        window.localStorage.setItem(chivesWallets, EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesWallets]: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }
        
        return true
    }
};

export function deleteWalletByWallet(WalletJwk: any, encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesWalletsList = window.localStorage.getItem(chivesWallets)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesWalletsList as string, encryptWalletDataKey)
        const walletExists = DecryptWalletData ? JSON.parse(DecryptWalletData) : []
        const leftWallets = walletExists.filter((wallet: any) => wallet.jwk.n !== WalletJwk.n);
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(leftWallets), encryptWalletDataKey)
        window.localStorage.setItem(chivesWallets, EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesWallets]: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }
        
        return true
    }
};

export function setMyAoTokens(Address: string, MyAoTokens: any, encryptWalletDataKey: string) {
    if (Address && Address.length === 43 && typeof window !== 'undefined') {
        const chivesMyAoTokensData = window.localStorage.getItem(chivesMyAoTokens)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesMyAoTokensData as string, encryptWalletDataKey)
        const chivesMyAoTokensObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        chivesMyAoTokensObject[Address] = MyAoTokens
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(chivesMyAoTokensObject), encryptWalletDataKey)
        window.localStorage.setItem(chivesMyAoTokens, EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesMyAoTokens]: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }
    }
    
    return true
}

export function addMyAoToken(Address: string, TokenInfor: any, encryptWalletDataKey: string) {
    if (Address && Address.length === 43 && typeof window !== 'undefined') {
        const chivesTokenInforData = window.localStorage.getItem(chivesMyAoTokens)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesTokenInforData as string, encryptWalletDataKey)
        const chivesTokenInforObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        if(chivesTokenInforObject[Address]) {
            chivesTokenInforObject[Address] = [...chivesTokenInforObject[Address], ...[TokenInfor]]
        }
        else {
            chivesTokenInforObject[Address] = [TokenInfor]
        }
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(chivesTokenInforObject), encryptWalletDataKey)
        window.localStorage.setItem(chivesMyAoTokens, EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesMyAoTokens]: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }
    }
    
    return true
}

export function deleteMyAoToken(Address: string, TokenId: string, encryptWalletDataKey: string) {
    if (Address && Address.length === 43 && typeof window !== 'undefined') {
        const chivesMyAoTokensData = window.localStorage.getItem(chivesMyAoTokens)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesMyAoTokensData as string, encryptWalletDataKey)
        const chivesMyAoTokensObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        const MyAoTokens = chivesMyAoTokensObject[Address]
        const MyAoTokensFilter = MyAoTokens.filter((item: any)=>item.TokenId!=TokenId)
        chivesMyAoTokensObject[Address] = MyAoTokensFilter
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(chivesMyAoTokensObject), encryptWalletDataKey)
        window.localStorage.setItem(chivesMyAoTokens, EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesMyAoTokens]: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }
    }
    
    return true
}

export function getMyAoTokens(Address: string, encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesMyAoTokensData = window.localStorage.getItem(chivesMyAoTokens)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesMyAoTokensData as string, encryptWalletDataKey)
        const chivesMyAoTokensObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        
        return chivesMyAoTokensObject[Address] ?? []
    }
}

export function setAllAoTokens(Address: string, AllAoTokens: any, encryptWalletDataKey: string) {
    if (Address && Address.length === 43 && typeof window !== 'undefined') {
        const chivesAllAoTokensData = window.localStorage.getItem(chivesAllAoTokens)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesAllAoTokensData as string, encryptWalletDataKey)
        const chivesAllAoTokensObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        chivesAllAoTokensObject[Address] = AllAoTokens
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(chivesAllAoTokensObject), encryptWalletDataKey)
        window.localStorage.setItem(chivesAllAoTokens, EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesAllAoTokens]: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }
    }
    
    return true
}

export function getAllAoTokens(Address: string, encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesAllAoTokensData = window.localStorage.getItem(chivesAllAoTokens)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesAllAoTokensData as string, encryptWalletDataKey)
        const chivesAllAoTokensObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        
        return chivesAllAoTokensObject[Address] ?? []
    }
}


export function setAllAoFaucets(Address: string, AllAoFaucets: any, encryptWalletDataKey: string) {
    if (Address && Address.length === 43 && typeof window !== 'undefined') {
        const chivesAllAoFaucetsData = window.localStorage.getItem(chivesAllAoFaucets)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesAllAoFaucetsData as string, encryptWalletDataKey)
        const chivesAllAoFaucetsObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        chivesAllAoFaucetsObject[Address] = AllAoFaucets
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(chivesAllAoFaucetsObject), encryptWalletDataKey)
        window.localStorage.setItem(chivesAllAoFaucets, EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesAllAoFaucets]: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }
    }
    
    return true
}

export function getAllAoFaucets(Address: string, encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesAllAoFaucetsData = window.localStorage.getItem(chivesAllAoFaucets)
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesAllAoFaucetsData as string, encryptWalletDataKey)
        const chivesAllAoFaucetsObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        
        return chivesAllAoFaucetsObject[Address] ?? []
    }
}

export function setMyAoFaucetTokenBalance(Address: string, MyAoFaucetTokenBalance: any, encryptWalletDataKey: string) {
    if (Address && Address.length === 43 && typeof window !== 'undefined') {
        const chivesMyAoFaucetTokenBalanceData = window.localStorage.getItem("chivesMyAoFaucetTokenBalance")
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesMyAoFaucetTokenBalanceData as string, encryptWalletDataKey)
        const chivesMyAoFaucetTokenBalanceObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        chivesMyAoFaucetTokenBalanceObject[Address] = MyAoFaucetTokenBalance
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(chivesMyAoFaucetTokenBalanceObject), encryptWalletDataKey)
        window.localStorage.setItem("chivesMyAoFaucetTokenBalance", EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ chivesMyAoFaucetTokenBalance: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }
    }
    
    return true
}

export function getMyAoFaucetTokenBalance(Address: string, encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesMyAoFaucetTokenBalanceData = window.localStorage.getItem("chivesMyAoFaucetTokenBalance")
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesMyAoFaucetTokenBalanceData as string, encryptWalletDataKey)
        const chivesMyAoFaucetTokenBalanceObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        
        return chivesMyAoFaucetTokenBalanceObject[Address] ?? []
    }
}


export function setTokenAllHolderTxs(Address: string, AllHolderTxs: any, encryptWalletDataKey: string) {
    if (Address && Address.length === 43 && AllHolderTxs && typeof window !== 'undefined') {
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(AllHolderTxs), encryptWalletDataKey)
        window.localStorage.setItem("chivesAllHolderTxs____" + calculateSHA256(Address), EncryptWalletData)
    }
    
    return true
}

export function getTokenAllHolderTxs(Address: string, encryptWalletDataKey: string) {
    if(typeof window !== 'undefined')  {
        const chivesAllHolderTxsData = window.localStorage.getItem("chivesAllHolderTxs____" + calculateSHA256(Address))
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesAllHolderTxsData as string, encryptWalletDataKey)
        const chivesAllHolderTxsObject = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        
        return chivesAllHolderTxsObject
    }
}

export async function getWalletBalance(Address: string) {    
    try {

        return arweave.ar.winstonToAr(await arweave.wallets.getBalance(Address))
    } 
    catch (e) { 
        console.warn('getWalletBalance failed') 
    }
}

export async function getWalletBalanceWinston(Address: string) {
    try {

        return await arweave.wallets.getBalance(Address)
    } 
    catch (e) { 
        console.warn('getWalletBalance failed') 
    }
}

export async function getPrice(byteSize: number) {
    try {

        return arweave.ar.winstonToAr(await arweave.transactions.getPrice(byteSize))
    } 
    catch (e) { 
        console.warn('getWalletBalance failed') 
    }
}

export async function getPriceWinston(byteSize: number) {
    try {

        return await arweave.transactions.getPrice(byteSize)
    } 
    catch (e) { 
        console.warn('getWalletBalance failed') 
    }
}

export async function getWalletBalanceReservedRewards(Address: string) {
    try {
        const reserved_rewards_total = await axios.get(authConfig.backEndApi + '/wallet/' + Address + '/reserved_rewards_total', { timeout: 10000 } ).then(res=>res.data);

        return arweave.ar.winstonToAr(reserved_rewards_total)
    } 
    catch (e) { 
        console.warn('getWalletBalance failed') 
    }
}

export async function getTxsInMemory() {
    try {
        if(authConfig.tokenType == "XWE")           {
            const response = await axios.get(authConfig.backEndApi + '/tx/pending/record', { timeout: 10000 } ).then(res=>res.data);
            if(response && response.length>0) {
                const SendTxsInMemory: any = {}
                const ReceiveTxsInMemory: any = {}
                for (const item of response) {
                    if(SendTxsInMemory[item.owner.address])  {
                        SendTxsInMemory[item.owner.address] = BalancePlus(Number(item.quantity.xwe), Number(SendTxsInMemory[item.owner.address]))
                    }
                    else {
                        SendTxsInMemory[item.owner.address] = Number(item.quantity.xwe)
                    }
                    if(ReceiveTxsInMemory[item.recipient])  {
                        ReceiveTxsInMemory[item.recipient] = BalancePlus(Number(item.quantity.xwe), Number(ReceiveTxsInMemory[item.recipient]))
                    }
                    else {
                        ReceiveTxsInMemory[item.recipient] = Number(item.quantity.xwe)
                    }
                }
                
                return {send: SendTxsInMemory, receive: ReceiveTxsInMemory}
            }
        }
    } 
    catch (e) { 
        console.warn('getTxsInMemory failed') 
    }
}

export async function getXweWalletAllTxs(Address: string, Type: string, pageId = 0, pageSize = 10) {

    let addressApiType = ''
    switch(Type) {
        case 'AllTxs':
            addressApiType = "txsrecord";
            break;
        case 'Sent':
            addressApiType = "send";
            break;
        case 'Received':
            addressApiType = "deposits";
            break;
        case 'Files':
            addressApiType = "datarecord";
            break;
    }
    try {
        if(addressApiType && addressApiType!="" && Address && Address.length == 43)  {
            const response = await axios.get(authConfig.backEndApi + '/wallet/' + `${Address}` + '/' + `${addressApiType}` + '/' + `${pageId}` + '/' + pageSize, { timeout: 10000 }).then(res=>res.data)
            const NewData: any[] = response.data.filter((record: any) => record.recipient)
            response.data = NewData
            
            return response
        }
    } 
    catch (e) { 
        console.warn('getXweWalletAllTxs failed') 
    }

}

export function winstonToAr(winston: string) {
    
    return arweave.ar.winstonToAr(winston)
}

export function arToWinston(ar: string) {
    
    return arweave.ar.arToWinston(ar)
}

export function isAddress(address: string) {
    return !!address?.match(/^[a-z0-9_-]{43}$/i)
}

export function downloadTextFile(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export async function downloadUrlFile(url: string, fileName: string, mimeType: string) {
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function removePunctuation(text: string) {
    if(text) {
        return String(text).replace(/[^\w\s\u4e00-\u9fa5]/g, '');
    }
    else {
        return "";
    }
}

export async function readFile (file: File) {
    return new Promise<Uint8Array>((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = (e) => resolve(new Uint8Array(e.target?.result as any))
      fileReader.onerror = (e) => reject(e)
      fileReader.readAsArrayBuffer(file)
    })
}

export async function readFileText(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => resolve(e.target?.result as string);
        fileReader.onerror = (e) => reject(e);
        fileReader.readAsText(file);
    });
}

export async function sendAmount(walletData: any, target: string, amount: string, tags: any, data: string | Uint8Array | ArrayBuffer | undefined, fileName: string, setUploadProgress: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>) {
    const quantity = amount && amount.length > 0 && amount != "" ? arweave.ar.arToWinston(new BigNumber(amount).toString()) : '0' ;

    //Check Fee and Send Amount must smaller than wallet balance

    const txSettings:any = {}
    if(target && target.length == 43 && Number(quantity) > 0) {
	    txSettings.target = target
        txSettings.quantity = quantity
    }
	if (data && data != undefined && data != '') { txSettings.data = data }

    //Make Tx Data
    const tx = await arweave.createTransaction(txSettings)
    
    //Add Tags
    for (const tag of tags || []) { tx.addTag(tag.name, tag.value) }
    
    await arweave.transactions.sign(tx, walletData.jwk);
    const currentFee = await getPriceWinston(Number(tx.data_size))
    const currentBalance = await getWalletBalanceWinston(walletData.data.arweave.key)

    if(Number(currentBalance) < (Number(currentFee) + Number(quantity)) )       {

        return { status: 800, statusText: 'Insufficient balance, need: ' + winstonToAr(String(Number(currentFee) + Number(quantity))) }
    }
    
    //console.log('currentBalance', currentBalance);
    //console.log('currentFee', currentFee);
    //console.log('quantity', Number(quantity));

    if (!tx.chunks?.chunks?.length) { 
		const txResult = await arweave.transactions.post(tx);
		if(txResult.status==200) {
			console.log('Transaction sent', txResult);
            
            //Update the upload process
            fileName && fileName.length > 0 && setUploadProgress((prevProgress) => {
                
                return {
                ...prevProgress,
                [fileName]: 100,
                };
            });
		}
		else if(txResult.status==400) {
			console.error(txResult.statusText, txResult); 
		}
		else {			
			console.log('Unknow error', txResult);
		}

		return txResult; 
	}

    //Upload Data if have Chunks
    const UploadChunksStatus: any = {}
    const uploader = await arweave.transactions.getUploader(tx)
	const storageKey = 'uploader:' + tx.id
	localStorage.setItem(storageKey, JSON.stringify(uploader))
	UploadChunksStatus[tx.id] ??= {}
	UploadChunksStatus[tx.id].upload = 0
    console.log('Begin upload data txid', tx.id)
    
    //console.log('uploader begin: ', uploader)
    let uploadRecords = 0
	while (!uploader.isComplete) {
		await uploader.uploadChunk()
		localStorage.setItem(storageKey, JSON.stringify(uploader))
		UploadChunksStatus[tx.id].upload = uploader.pctComplete
        
        //Update the upload process
        fileName && fileName.length > 0 && setUploadProgress((prevProgress) => {
            
            return {
            ...prevProgress,
            [fileName]: uploader.pctComplete,
            };
        });
		
        //console.log("uploader processing: ",uploadRecords, uploader.pctComplete)
        uploadRecords = uploadRecords + 1
	}
	if(uploader.isComplete) {
		localStorage.removeItem(storageKey)
		setTimeout(() => delete UploadChunksStatus[tx.id], 1000)
		console.log('Transaction sent: ', tx)
        
        //Update the upload process
        fileName && fileName.length > 0 && setUploadProgress((prevProgress) => {
            
            return {
            ...prevProgress,
            [fileName]: uploader.pctComplete,
            };
        });
	}
	else {
		console.error('Transaction error', tx)
	}

    //console.log('uploader end: ', uploader)
    //console.log('UploadChunksStatus: ', UploadChunksStatus)

    return tx; 
}

export function encode (text: string) {
	const encoder = new TextEncoder()
	
    return encoder.encode(text)
}

export function decode (buffer: BufferSource) {
	const decoder = new TextDecoder()
	
    return decoder.decode(buffer)
}

export async function getHash (data: string | Uint8Array) {
	const content = typeof data === 'string' ? encode(data) : data
	const buffer = await window.crypto.subtle.digest('SHA-256', content)
    
    //@ts-ignore
    return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('')
}

export async function getProcessedData(walletData: any, walletAddress: string, data: any, Manifest: boolean, BundleTypeArray: string[]): Promise<ArTxParams['data']> {
	if (typeof data === 'string') { return data }
    console.log("getProcessedData Input File Data:", data)
	if (!walletData) { throw 'multiple files unsupported for current account' }
    if (walletData && walletData.jwk && data && data.length > 0) {
        const bundleItems: any[] = []
        let dataItems: any = null
        if(BundleTypeArray && BundleTypeArray[0] && BundleTypeArray[1])  {
            //Profile
            const BundleTypeMap: any = {}
            const dataItemsMain = data.slice(0, -1);
            const dataItemsList = await Promise.all(dataItemsMain.map((item: any) => createDataItem(walletData, item)))
            console.log("dataItemsList", dataItemsList)
            dataItemsList.map((item: any, index: number)=>{
                if(item && item?.id!=undefined && item?.id.length == 43) {
                    BundleTypeMap[BundleTypeArray[index]] = item?.id
                }
            })
            const dataContent = data.slice(-1)[0]  
            console.log("dataContent", dataContent)
            console.log("BundleTypeMap", BundleTypeMap)  
            const jsonData = JSON.parse(dataContent['data'])
            if(BundleTypeMap['Avatar'] != undefined && BundleTypeMap['Avatar'].length == 43)      {
                jsonData['Avatar'] = BundleTypeMap['Avatar']
            }
            if(BundleTypeMap['Banner'] != undefined && BundleTypeMap['Banner'].length == 43)      {
                jsonData['Banner'] = BundleTypeMap['Banner']
            }
            const jsonDataNew: any[] = [{...dataContent, ['data']: JSON.stringify(jsonData)}]
            console.log("jsonDataNew____________________", jsonDataNew)
            const dataContentList = await Promise.all(jsonDataNew.map((item: any) => createDataItem(walletData, item)))  
            console.log("dataContentList", dataContentList)  
            dataItems = dataItemsList.concat(dataContentList) 
            console.log("dataItems______________________", dataItems)  
            
        }
        else {
            //Other Case
            dataItems = await Promise.all(data.map((item: any) => createDataItem(walletData, item)))
        }
        
        //dataItems.map((item: any)=>{
        //    console.log("getProcessedData item id:", item?.id)
        //})
        
        const trustedAddresses = walletAddress ? [walletAddress] : []
        const deduplicated = await deduplicate(dataItems, trustedAddresses)
        const deduplicatedDataItems = dataItems.map((item: any, i: number) => deduplicated[i] || item)
        console.log("getProcessedData deduplicatedDataItems:", deduplicatedDataItems)
        bundleItems.push(...deduplicatedDataItems.filter((item: any): item is Exclude<typeof item, string> => typeof item !== 'string'))
        console.log("getProcessedData bundleItems 1:", bundleItems)
        if(Manifest)  {
            try {
                const paths = data.map((item: any) => item.path || '')
                const index = paths.find((path: any) => path === 'index.html')
                const manifest = generateManifest(paths, deduplicatedDataItems, index)
                bundleItems.push(await createDataItem(walletData, { ...manifest }))
                console.log("getProcessedData bundleItems 2:", bundleItems)
            } 
            catch (e) { 
                console.warn('manifest generation failed') 
            }
        }
        
        return (await createBundle(walletData, bundleItems)).getRaw()
    }
    else { 
        throw 'multiple files unsupported for '
    }
}


//Check File Hash from mainnet, if file have exist on mainnet, should not upload
async function deduplicate (transactions: ArDataItemParams[], trustedAddresses?: string[]): Promise<Array<string | undefined>> {
	const entries = (await PromisePool.for(transactions).withConcurrency(5).process(async tx =>
		({ tx, hash: tx.tags?.find(tag => tag.name === 'File-Hash')?.value || await getHash(tx.data) }))).results
	const chunks = [] as typeof entries[]
	while (entries.length) { chunks.push(entries.splice(0, 500)) }
	
    return (await PromisePool.for(chunks).withConcurrency(3).process(async chunk => {
        const checkResultOnMainnet: any[] = await axios.get(authConfig.backEndApi + '/statistics_network', { timeout: 10000 })
                                .then(() => {
                                        
                                        //console.log("deduplicate in lib", res.data)
                                        
                                        return []
                                    }
                                )

		return (await PromisePool.for(chunk).withConcurrency(3).process(async entry => {
            const result = checkResultOnMainnet
				.filter((tx: any) => tx.tags.find((tag: any) => tag.name === 'File-Hash' && tag.value === entry.hash))
				.filter((tx: any) => !entry.tx.tags || hasMatchingTags(entry.tx.tags, tx.tags))
			for (const tx of result) {
				const verified = trustedAddresses ? trustedAddresses.includes(tx.owner.address) : await verifyData(entry.hash, tx.id)
				if (verified) { return tx }
			}
		})).results
	})).results.flat().map(tx => tx?.node.id)
}


export function hasMatchingTags(requiredTags: { name: string; value: string }[], existingTags: { name: string; value: string }[]): boolean {
	
    return !requiredTags.find(requiredTag => !existingTags.find(existingTag =>
		existingTag.name === requiredTag.name && existingTag.value === requiredTag.value))
}

async function verifyData (hash: string, id: string) {
    console.log("verifyData", hash, id)
} // todo store verification results in cache

export async function getSize (data: any, processedData: any): Promise<number> {
	if (typeof data === 'string') { return data.length }
	const processed = processedData
	if (processed == undefined) { throw 'Error' }
	if (typeof processed === 'string') { return data.length }
	
    return ArrayBuffer.isView(processed) ? processed?.byteLength : new Uint8Array(processed).byteLength
}

export function generateManifest (localPaths: string[], transactions: Array<{ id: string } | string>, index?: string) {
	if (localPaths.length !== transactions.length) { throw 'Length mismatch' }
	if (index && !localPaths.includes(index)) { throw 'Unknown index' }
	const paths = {} as { [key: string]: { id: string } }
	localPaths.forEach((path, i) => {
		if (!path) { throw 'Path undefined' }
		const tx = transactions[i]
		const id = typeof tx === 'string' ? tx : tx.id
		paths[path] = { id }
	})
	const indexParam = index ? { index: { path: index } } : {}
	
    return {
		data: JSON.stringify({
			manifest: 'chivesweave/paths',
			version: '0.1.0',
			...indexParam,
			paths,
		}),
		tags: [{ name: 'Content-Type', value: 'application/x.chivesweave-manifest+json' }]
	}
}

async function createDataItem (walletData: any, item: ArDataItemParams) {
    // @ts-ignore
    const { createData, signers } = await import('../../scripts/arbundles')
    const { data, tags, target } = item
    const signer = new signers.ArweaveSigner(walletData.jwk)
    const anchor = arweave.utils.bufferTob64(crypto.getRandomValues(new Uint8Array(32))).slice(0, 32)
    const dataItem = createData(data, signer, { tags, target, anchor })
    await dataItem.sign(signer)
    
    return dataItem
}

export async function createDataItemSigner (walletDataJwk: any, item: ArDataItemParams) {
    // @ts-ignore
    const { createData, signers } = await import('../../scripts/arbundles')
    const { data, tags, target } = item
    const signer = new signers.ArweaveSigner(walletDataJwk)
    const anchor = arweave.utils.bufferTob64(crypto.getRandomValues(new Uint8Array(32))).slice(0, 32)
    const dataItem = createData(data, signer, { tags, target, anchor })
    await dataItem.sign(signer)
    
    return {
        id: dataItem.id,
        raw: dataItem.getRaw()
    }
}


async function createBundle (walletData: any, items: Awaited<ReturnType<typeof createDataItem>>[]) {
    // @ts-ignore
    const { bundleAndSignData, signers } = await import('../../scripts/arbundles')
    const signer = new signers.ArweaveSigner(walletData.jwk)
    
    return bundleAndSignData(items, signer)
}

export async function pkcs8ToJwk (key: Uint8Array) {
	const imported = await window.crypto.subtle.importKey('pkcs8', key, { name: 'RSA-PSS', hash: 'SHA-256' }, true, ['sign'])
	const jwk = await window.crypto.subtle.exportKey('jwk', imported)
	delete jwk.key_ops
	delete jwk.alg

	return jwk
}

export async function getDecryptionKey (key: JsonWebKey, hash = 'SHA-256') {
	const jwk = { ...key }
	delete jwk.key_ops
	delete jwk.alg

	return window.crypto.subtle.importKey('jwk', jwk, { name: 'RSA-OAEP', hash }, false, ['decrypt'])
}

export async function getEncryptionKey (n: string, hash = 'SHA-256') {
	const jwk = { kty: "RSA", e: "AQAB", n, alg: "RSA-OAEP-256", ext: true }

	return window.crypto.subtle.importKey('jwk', jwk, { name: 'RSA-OAEP', hash }, false, ['encrypt'])
}

export async function encryptWithPublicKey(publicKeyString: string, plaintext: string) {
	const publicKey = await getEncryptionKey(publicKeyString);
	const encodedText = new TextEncoder().encode(plaintext);
	const encryptedData = await window.crypto.subtle.encrypt(
		{
		name: 'RSA-OAEP',
		},
		publicKey,
		encodedText
	);
    const uint8Array = new Uint8Array(encryptedData);
    const base64String = Buffer.from(uint8Array).toString('base64');

	return base64String;
}

export async function decryptWithPrivateKey(privateKeyJwk: any, encryptedData: string) {
    const buffer = Buffer.from(encryptedData, 'base64');
    const arrayBuffer = buffer.buffer;
	const privateKey = await getDecryptionKey(privateKeyJwk);
	console.log("privateKey", privateKey)
	const decryptedData = await window.crypto.subtle.decrypt(
		{
		name: 'RSA-OAEP',
		},
		privateKey,
		arrayBuffer
	);
	console.log("decryptedData", decryptedData)
	const decryptedText = new TextDecoder().decode(decryptedData);

	return decryptedText;
}


//#########################################################################################################################################

export function setChivesContacts(Address: string, Name: string, encryptWalletDataKey: string) {
    try {
        const chivesContactsText = window.localStorage.getItem(chivesContacts)   
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesContactsText as string, encryptWalletDataKey)   
        const chivesContactsList = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        chivesContactsList[Address] = Name
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(chivesContactsList), encryptWalletDataKey)
        window.localStorage.setItem(chivesContacts, EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesContacts]: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }

        return chivesContactsList
    }
    catch (error: any) {
        console.error(`setChivesContacts Error`, error);
    }
}

export function deleteChivesContacts(Address: string, encryptWalletDataKey: string) {
    try {
        const chivesContactsText = window.localStorage.getItem(chivesContacts)     
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesContactsText as string, encryptWalletDataKey) 
        const chivesContactsList = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        if (Address in chivesContactsList) {
            delete chivesContactsList[Address];
        }
        const EncryptWalletData = EncryptWalletDataAES256GCMV1(JSON.stringify(chivesContactsList), encryptWalletDataKey)
        window.localStorage.setItem(chivesContacts, EncryptWalletData)
        if(chrome && chrome.storage && chrome.storage.sync)   {
            chrome.storage.sync.set({ [chivesContacts]: EncryptWalletData }, () => {
                console.log('Data saved to chrome.storage:', EncryptWalletData);
            });
        }

        return chivesContactsList
    }
    catch (error: any) {
        console.error(`deleteChivesContacts Error`, error);
    }
}

export function searchChivesContacts(searchValue: string, encryptWalletDataKey: string) {
    try {
        const chivesContactsText = window.localStorage.getItem(chivesContacts)    
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesContactsText as string, encryptWalletDataKey)  
        const chivesContactsList = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}
        
        const result: any = {};
        
        for (const key in chivesContactsList) {
            if (key.toLowerCase().includes(searchValue.toLowerCase()) || chivesContactsList[key].toLowerCase().includes(searchValue.toLowerCase())) {
                result[key] = chivesContactsList[key]
            }
        }

        if(Object.keys(result).length == 0 && searchValue && searchValue.length == 43)  {
            result[searchValue] = 'Input Address'
        }
        
        return result
    }
    catch (error: any) {
        console.error(`deleteChivesContacts Error`, error);
    }
}

export function getChivesContacts(encryptWalletDataKey: string) {
    try {
        const chivesContactsText = window.localStorage.getItem(chivesContacts)      
        const DecryptWalletData = DecryptWalletDataAES256GCMV1(chivesContactsText as string, encryptWalletDataKey)
        const chivesContactsList = DecryptWalletData ? JSON.parse(DecryptWalletData) : {}

        return chivesContactsList
    }
    catch (error: any) {
        console.error(`getChivesContacts Error`, error);
    }
}

export function GetFileCacheStatus(Drive: any) {
    const CacheStatus: any = {}
    const FullStatus: any = {}
    
    //Step 1: Database
    if(Drive && Drive.table && Drive.table.item_star && Drive.table.item_star=="Star")  {
        FullStatus['Star'] = true
    }
    if(Drive && Drive.table && Drive.table.item_label)  {
        FullStatus['Label'] = Drive.table.item_label
    }
    
    //Step 2 : Local Storage Cache
    if(typeof window !== 'undefined')  {
        const TxId: string = Drive?.id
        const ChivesDriveActions = authConfig.chivesDriveActions
        const ChivesDriveActionsList = window.localStorage.getItem(ChivesDriveActions)      
        const ChivesDriveActionsMap: any = ChivesDriveActionsList ? JSON.parse(ChivesDriveActionsList) : {}
        if(ChivesDriveActionsMap && ChivesDriveActionsMap['Star'] && ChivesDriveActionsMap['Star'][TxId] !== undefined )  {
            CacheStatus['Star'] = ChivesDriveActionsMap['Star'][TxId];
            FullStatus['Star'] = ChivesDriveActionsMap['Star'][TxId];
        }
        if(ChivesDriveActionsMap && ChivesDriveActionsMap['Label'] && ChivesDriveActionsMap['Label'][TxId] !== undefined )  {
            CacheStatus['Label'] = ChivesDriveActionsMap['Label'][TxId];
            FullStatus['Label'] = ChivesDriveActionsMap['Label'][TxId];
        }
        if(ChivesDriveActionsMap && ChivesDriveActionsMap['Folder'] && ChivesDriveActionsMap['Folder'][TxId] !== undefined )  {
            CacheStatus['Folder'] = ChivesDriveActionsMap['Folder'][TxId];
            FullStatus['Folder'] = ChivesDriveActionsMap['Folder'][TxId];
        }

        const chivesTxStatusText = window.localStorage.getItem(chivesTxStatus)      
        const chivesTxStatusList = chivesTxStatusText ? JSON.parse(chivesTxStatusText) : []

        if(chivesTxStatusList && chivesTxStatusList.length > 0)  {
            chivesTxStatusList.map(async (Item: any) => {
                const ChivesDriveActionsMaTx = Item.ChivesDriveActionsMap;
                if(ChivesDriveActionsMaTx && ChivesDriveActionsMaTx['Star'] && ChivesDriveActionsMaTx['Star'][TxId] !== undefined )  {
                    CacheStatus['Star'] = ChivesDriveActionsMaTx['Star'][TxId];
                    FullStatus['Star'] = ChivesDriveActionsMaTx['Star'][TxId];
                }
                if(ChivesDriveActionsMaTx && ChivesDriveActionsMaTx['Label'] && ChivesDriveActionsMaTx['Label'][TxId] !== undefined )  {
                    CacheStatus['Label'] = ChivesDriveActionsMaTx['Label'][TxId];
                    FullStatus['Label'] = ChivesDriveActionsMaTx['Label'][TxId];
                }
                if(ChivesDriveActionsMaTx && ChivesDriveActionsMaTx['Folder'] && ChivesDriveActionsMaTx['Folder'][TxId] !== undefined )  {
                    CacheStatus['Folder'] = ChivesDriveActionsMaTx['Folder'][TxId];
                    FullStatus['Folder'] = ChivesDriveActionsMaTx['Folder'][TxId];
                }            
            })
        }
    }

    return {"FullStatus":FullStatus, "CacheStatus":CacheStatus};
}

export function getChivesLanguage() {
    if(typeof window !== 'undefined')  {
        const ChivesLanguage = window.localStorage.getItem(chivesLanguage) || "en"

        return ChivesLanguage
    }
    else {

        return "en"
    }
};

export function setChivesLanguage(Language: string) {
    window.localStorage.setItem(chivesLanguage, Language)
    if(chrome && chrome.storage && chrome.storage.sync)   {
        chrome.storage.sync.set({ [chivesLanguage]: Language }, () => {
            console.log('Data saved to chrome.storage:', Language);
        });
    }

    return true
};

export const getNanoid = (size = 12) => {
    return customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', size)();
};