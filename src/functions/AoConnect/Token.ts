
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "@permaweb/aoconnect"
import authConfig from '../../configs/auth'

import axios from 'axios'

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, BalanceTimes10 } from '../../functions/AoConnect/AoConnect'

export const AoLoadBlueprintToken = async (currentWalletJwk: any, AoConnectOwner: string, processTxId: string, tokenInfo: any) => {
    try {
        if(processTxId && processTxId.length != 43) {

            return
        }
        if(typeof processTxId != 'string') {

            return 
        }

        let Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoWalletWebsite/main/blueprints/chivestoken.lua', { timeout: 10000 }).then(res => res.data)
        
        if(Data == undefined || Data == null) {

            return { status: 'error', msg: 'Lua file not loaded.' }; 
        }

        //Filter Token Infor
        if(tokenInfo && tokenInfo.Name) {
            Data = Data.replace("AoConnectToken", tokenInfo.Name)
        }
        if(tokenInfo && tokenInfo.Ticker) {
            Data = Data.replace("AOCN", tokenInfo.Ticker)
        }
        if(tokenInfo && tokenInfo.Balance) {
            Data = Data.replace("9999", tokenInfo.Balance)
        }
        if(tokenInfo && tokenInfo.Logo) {
            Data = Data.replace("dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ", tokenInfo.Logo)
        }
        if(tokenInfo && tokenInfo.Denomination) {
            Data = Data.replace("12", tokenInfo.Denomination)
        }
        if(AoConnectOwner && AoConnectOwner.length == 43) {
            Data = Data.replaceAll("AoConnectOwner", AoConnectOwner)
        }

        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetMyLastMsgResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: Data,
        });
        console.log("AoLoadBlueprintModule GetMyLastMsg", module, GetMyLastMsgResult)
        
        if(GetMyLastMsgResult && GetMyLastMsgResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetMyLastMsgResult)
            console.log("AoLoadBlueprintModule MsgContent", module, MsgContent)

            return { status: 'ok', id: GetMyLastMsgResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("AoLoadBlueprintToken Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}

export const AoTokenTransfer = async (currentWalletJwk: any, tokenTxId: string, sendOutAddress: string, sendOutAmount: number, Denomination = 12) => {
    try {
        if(tokenTxId && tokenTxId.length != 43) {

            return
        }
        if(sendOutAddress && sendOutAddress.length != 43) {

            return
        }
        if(typeof tokenTxId != 'string' || typeof sendOutAddress != 'string') {

            return 
        }
        
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const data = {
            process: tokenTxId,
            tags: [
              { name: "Action", value: "Transfer" },
              { name: "Recipient", value: sendOutAddress },
              { name: "Quantity", value: String(BalanceTimes10(sendOutAmount, Denomination)) },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const SendTokenResult = await message(data);

        if(SendTokenResult && SendTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(tokenTxId, SendTokenResult)

            return { status: 'ok', id: SendTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenTransfer Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const AoTokenMint = async (currentWalletJwk: any, tokenTxId: string, mintAmount: number, Denomination = 12) => {
    try {
        if(tokenTxId && tokenTxId.length != 43) {

            return
        }
        if(typeof tokenTxId != 'string') {

            return 
        }
        
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const data = {
            process: tokenTxId,
            tags: [
              { name: "Action", value: "Mint" },
              { name: "Quantity", value: String(BalanceTimes10(mintAmount, Denomination)) },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const SendTokenResult = await message(data);
        console.log("AoTokenMint Transfer", SendTokenResult)
        
        if(SendTokenResult && SendTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(tokenTxId, SendTokenResult)

            return { status: 'ok', id: SendTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenTransfer Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const AoTokenAirdrop = async (currentWalletJwk: any, tokenTxId: string, AddressList: string, AmountList: string, Denomination = 12) => {
    try {
        if(tokenTxId && tokenTxId.length != 43) {

            return
        }
        if(typeof tokenTxId != 'string') {

            return 
        }

        const AddressListData = AddressList.split('****')
        AddressListData.map((item: string, index: number)=>{
            if(item && item.length != 43) {
                console.log("AoTokenAirdrop AddressListData address length not equal 43, line: ", index, " Address: ", item)

                return 
            }
        })
        const AmountListData = AmountList.split('****')
        AmountListData.map((item: string, index: number)=>{
            if(item && Number(item) <= 0) {
                console.log("AoTokenAirdrop AmountListData Amount < 0, line: ", index, " Amount: ", item)

                return 
            }
        })
        const AmountListArray = AmountList.split('****')
        const AmountListFilter = AmountListArray.map(item => String(BalanceTimes10(Number(item), Denomination)))
        const AmountListString = AmountListFilter.join('****')
        
        
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const data = {
            process: tokenTxId,
            tags: [
              { name: "Action", value: "Airdrop" },
              { name: "Recipient", value: AddressList },
              { name: "Quantity", value: AmountListString },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const SendTokenResult = await message(data);
        console.log("AoTokenAirdrop Airdrop", SendTokenResult)
        
        if(SendTokenResult && SendTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(tokenTxId, SendTokenResult)

            return { status: 'ok', id: SendTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenAirdrop Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const AoTokenBalanceDryRun = async (TargetTxId: string, currentAddress: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(currentAddress && currentAddress.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string' || typeof currentAddress != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: currentAddress,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Balance' },
                { name: 'Target', value: currentAddress },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return result.Messages[0].Data
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenBalanceDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoTokenBalancesDryRun = async (TargetTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Balances' },
                { name: 'Target', value: TargetTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return result.Messages[0].Data
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenBalancesDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoTokenBalancesPageDryRun = async (TargetTxId: string, startIndex: string, endIndex: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'BalancesPage' },
                { name: 'Target', value: TargetTxId },
                { name: 'startIndex', value: startIndex },
                { name: 'endIndex', value: endIndex },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return result.Messages[0].Data
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenBalancesPageDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoTokenAllTransactions = async (TargetTxId: string, startIndex: string, endIndex: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'AllTransactions' },
                { name: 'Target', value: TargetTxId },
                { name: 'startIndex', value: startIndex },
                { name: 'endIndex', value: endIndex },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {
            type DataItem = [string, string, string, string];
            type DataStructure = [DataItem[], number];
            const jsonData: any[] = JSON.parse(result.Messages[0].Data) as DataStructure;

            return jsonData
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenAllTransactions Error:", Error)
        if(Error && Error.message) {
            
            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoTokenMyAllTransactions = async (TargetTxId: string, Sender: string, startIndex: string, endIndex: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(Sender && Sender.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        if(typeof Sender != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'MyAllTransactions' },
                { name: 'Target', value: TargetTxId },
                { name: 'Sender', value: Sender },
                { name: 'startIndex', value: startIndex },
                { name: 'endIndex', value: endIndex },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {
            type DataItem = [string, string, string, string];
            type DataStructure = [DataItem[], number];
            const jsonData: any[] = JSON.parse(result.Messages[0].Data) as DataStructure;

            return jsonData
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenAllTransactions Error:", Error)
        if(Error && Error.message) {
            
            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoTokenSentTransactions = async (TargetTxId: string, Sender: string, startIndex: string, endIndex: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: Sender,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'SentTransactions' },
                { name: 'Target', value: TargetTxId },
                { name: 'Sender', value: Sender },
                { name: 'startIndex', value: startIndex },
                { name: 'endIndex', value: endIndex },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {
            type DataItem = [string, string, string];
            type DataStructure = [DataItem[], number];
            const jsonData: any[] = JSON.parse(result.Messages[0].Data) as DataStructure;

            return jsonData
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenSentTransactions Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoTokenReceivedTransactions = async (TargetTxId: string, Recipient: string, startIndex: string, endIndex: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: Recipient,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'ReceivedTransactions' },
                { name: 'Target', value: TargetTxId },
                { name: 'Recipient', value: Recipient },
                { name: 'startIndex', value: startIndex },
                { name: 'endIndex', value: endIndex },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {
            type DataItem = [string, string, string];
            type DataStructure = [DataItem[], number];
            const jsonData: any[] = JSON.parse(result.Messages[0].Data) as DataStructure;

            return jsonData
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenReceivedTransactions Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoTokenInfoDryRun = async (TargetTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }

        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Info' },
                { name: 'Target', value: TargetTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Tags) {
            const RS: any = {}
            result.Messages[0].Tags.map((Item: any)=>{
                RS[Item.name] = Item.value
            })
            
            return RS
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenInfoDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoTokenInBoxDryRun = async (TargetTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }

        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Members' },
                { name: 'Target', value: TargetTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Tags) {
            const RS: any = {}
            result.Messages[0].Tags.map((Item: any)=>{
                RS[Item.name] = Item.value
            })

            return RS
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoTokenInfoDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const GetTokenAvatar = (Logo: string) => {
    if(Logo && Logo.length == 43)  {

        return authConfig.backEndApi + "/" + Logo
    }
    else {

        return ''
    }
}

export const GetAppAvatar = (logo: string) => {
    if(logo && logo.length == 43) {

        return authConfig.backEndApi + "/" + logo
    }
    else {

        return "/images/avatars/2.png"
    }

}

export const GetAppAvatarModId = (logo: string) => {
    if(logo) {

        return "/images/avatars/" + (logo[0].charCodeAt(0)%8 + 1) + ".png"
    }
    else {

        return "/images/avatars/2.png"
    }

}

export function downloadCsv(JsonData: any, FileName: string) {
    const blob = new Blob([JsonData], { type: 'application/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = FileName + '.csv';
    a.click();
    URL.revokeObjectURL(url);
}