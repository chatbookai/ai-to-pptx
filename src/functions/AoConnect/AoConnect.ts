
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "@permaweb/aoconnect"

import { ConvertInboxMessageFormatAndStorage } from './MsgReminder'
import authConfig from '../../configs/auth'
import BigNumber from 'bignumber.js'
import axios from 'axios'


export const MU_URL = "https://mu.ao-testnet.xyz"
export const CU_URL = "https://cu.ao-testnet.xyz"
export const GATEWAY_URL = "https://arweave.net"

import { ansiRegex } from '../../configs/functions'


export const AoSendMsg = async (currentWalletJwk: any, processTxId: string, Msg: string, Tags: any[]) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const sendMsgResult = await message({
            process: processTxId,
            tags: Tags,
            signer: createDataItemSigner(currentWalletJwk),
            data: Msg,
        });
        console.log("AoSendMsg sendMsgResult", sendMsgResult, "Tags", Tags, "data", Msg)
    
        return sendMsgResult;
    }
    catch(Error: any) {

        console.log("AoSendMsg Error", Error)
        if(Error && Error.message) {

            return Error.message;
        };
    }
}

export const AoGetLastPage = async (processTxId: string, Sort = 'DESC', Limit = 25) => {
    try {
        const { results } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const resultsOut = await results({
            process: processTxId,
            sort: Sort,
            limit: Limit,
        });

        return resultsOut
    }
    catch(Error: any) {
        console.error("AoGetLastPage Error:", Error)

        return []
    }
}

export const AoGetRecord = async (processTxId: string, messageTxId: string) => {
    try {
        const { result } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const resultsOut = await result({
            process: processTxId,
            message: messageTxId
        });

        return resultsOut
    }
    catch(Error: any) {
        console.error("AoGetRecord Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}

export const AoGetMessage = async (processTxId: string, messageTxId: string) => {
    try {
        const { result } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const resultsOut = await result({
            process: processTxId,
            message: messageTxId
        });

        return resultsOut
    }
    catch(Error: any) {
        console.error("AoGetMessage Error:", Error)
    }
}

export const AoGetPageRecords = async (processTxId: string, Sort = 'DESC', Limit = 25, From = '') => {
    try {
        const { results } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const resultsOut = await results({
            process: processTxId,
            from: From && From != '' ? From : undefined,
            sort: Sort, 
            limit: Limit,
        });

        return resultsOut
    }
    catch(Error: any) {
        console.error("AoGetPageRecords Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}

export const AoCreateProcess = async (currentWalletJwk: any, moduleTxId: string, scheduler: string, Tags: any[]) => {
    try {
        const { spawn } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const processTxId = await spawn({
            module: moduleTxId,
            scheduler: scheduler,
            signer: createDataItemSigner(currentWalletJwk),
            tags: Tags,
        });

        console.log("AoCreateProcess processTxId", processTxId)
    
        return processTxId;
    }
    catch(Error: any) {
        console.error("AoCreateProcess Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}

export const AoMonitor = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { monitor } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await monitor({
            process: processTxId,
            signer: createDataItemSigner(currentWalletJwk),
        });

        console.log("AoMonitor result", result)
    
        return result;
    }
    catch(Error: any) {
        console.error("AoMonitor Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}

export const AoUnMonitor = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { unmonitor } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await unmonitor({
            process: processTxId,
            signer: createDataItemSigner(currentWalletJwk),
        });

        console.log("AoUnMonitor result", result)
    
        return result;
    }
    catch(Error: any) {
        console.error("AoUnMonitor Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}

export const AoCreateProcessAuto = async (currentWalletJwk: any) => {
    try {

        const processTxId: any = await AoCreateProcess(currentWalletJwk, authConfig.AoConnectModule, String(authConfig.AoConnectScheduler), [{ "name": "Your-Tag-Name", "value": "Your-Tag-Value" }, { "name": "Creator", "value": "Chives-Network" }]);

        console.log("AoCreateProcessAuto processTxId", processTxId)
    
        return processTxId;
    }
    catch(Error: any) {
        console.error("AoCreateProcessAuto Error:", Error)
        if(Error && Error.message) {

            return Error.message
        }
    }
}

export const GetMyInboxMsg = async (currentWalletJwk: any, processTxId: string) => {
    
    const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

    const GetMyInboxMsgResult = await message({
        process: processTxId,
        tags: [ { name: 'Action', value: 'Eval' } ],
        signer: createDataItemSigner(currentWalletJwk),
        data: 'Inbox',
    });
    
    console.log("GetMyInboxMsg GetMyInboxMsgResult", GetMyInboxMsgResult, "processTxId", processTxId)

    if(GetMyInboxMsgResult && GetMyInboxMsgResult.length == 43) {
        const MsgContent = await AoGetMessage(processTxId, GetMyInboxMsgResult)
        console.log("GetMyInboxMsg MsgContent", MsgContent)
        if(MsgContent && MsgContent.Output && MsgContent.Output.data && MsgContent.Output.data.output) {
            const formatText = MsgContent.Output.data.output.replace(ansiRegex, '');
            const InboxMsgList: any[] = ConvertInboxMessageFormatAndStorage(formatText, processTxId, true)

            console.log("GetMyInboxMsg InboxMsgList", InboxMsgList)
            
            return { id: GetMyInboxMsgResult, msg: InboxMsgList };
        }
        else {
            return { id: GetMyInboxMsgResult };
        }
    }
    else {
        return { id: GetMyInboxMsgResult };
    }
    
}

export const GetMyInboxLastMsg = async (currentWalletJwk: any, processTxId: string, InboxDataFormat = 'Inbox[#Inbox]') => {
    
    const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

    const GetMyInboxMsgResult = await message({
        process: processTxId,
        tags: [ { name: 'Action', value: 'Eval' } ],
        signer: createDataItemSigner(currentWalletJwk),
        data: InboxDataFormat,
    });
    
    //console.log("GetMyInboxMsg GetMyInboxMsgResult", GetMyInboxMsgResult)

    if(GetMyInboxMsgResult && GetMyInboxMsgResult.length == 43) {
        const MsgContent = await AoGetMessage(processTxId, GetMyInboxMsgResult)
        if(MsgContent && MsgContent.Output && MsgContent.Output.data && MsgContent.Output.data.output) {
            const formatText = MsgContent.Output.data.output.replace(ansiRegex, '');
            const InboxMsgList: any[] = ConvertInboxMessageFormatAndStorage("{" + formatText + "}", processTxId, false)

            //console.log("GetMyInboxMsg InboxMsgList", InboxMsgList)
            
            return { id: GetMyInboxMsgResult, msg: InboxMsgList };
        }
        else {
            return { id: GetMyInboxMsgResult };
        }
    }
    else {
        return { id: GetMyInboxMsgResult };
    }
    
}

export const GetMyLastMsg = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetMyLastMsgResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Inbox[#Inbox].Data',
        });
        console.log("GetMyLastMsg GetMyLastMsg", GetMyLastMsgResult)
        
        if(GetMyLastMsgResult && GetMyLastMsgResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetMyLastMsgResult)
            console.log("GetMyLastMsg MsgContent", MsgContent)

            return { id: GetMyLastMsgResult, msg: MsgContent };
        }
        else {

            return { id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("GetMyLastMsg Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const AoLoadBlueprintModule = async (currentWalletJwk: any, processTxId: string, module: string) => {
    try {
        const Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoWalletWebsite/main/blueprints/' + module + '.lua', { timeout: 10000 }).then(res => res.data)
    
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

            return { id: GetMyLastMsgResult, msg: MsgContent };
        }
        else {

            return { id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("AoLoadBlueprintChatroom Error:", Error)

        // 重新执行函数直到成功为止
        setTimeout(async () => {

            return await AoLoadBlueprintModule(currentWalletJwk, processTxId, module);
        }, 15000)
    }
  
}

export const AoLoadBlueprintChat = async (currentWalletJwk: any, processTxId: string) => {

    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'chat')
}

export const generateRandomNumber = (min: number, max: number) => {

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const FormatBalanceString = (Balance: number, Denomination: number, Precision: number) => {
    const FormatBalanceData = FormatBalance(Balance, Denomination)

    return String(Number(FormatBalanceData).toFixed(Precision)).replace(/\.?0+$/, '')
}

export const FormatBalance = (Balance: number, Denomination: number) => {
    const DenominationNew = Denomination > 0 ? Denomination : 12
    const DivValue = Math.pow(10, DenominationNew)

    return (new BigNumber(Number(Balance))).div(DivValue).toFixed()
}

export const BalanceTimes10 = (Balance: number, Denomination: number) => {
    const DenominationNew = Denomination > 0 ? Denomination : 12
    const DivValue = Math.pow(10, DenominationNew)

    return (new BigNumber(Number(Balance))).times(DivValue).toString()
}

export const BalanceTimes = (Balance1: number, Balance2: number) => {
    const num1 = new BigNumber(Balance1);
    const num2 = new BigNumber(Balance2);
    const times = num1.times(num2);
    
    return times.toString()
}

export const BalanceDiv = (Balance1: number, Balance2: number) => {
    const num1 = new BigNumber(Balance1);
    const num2 = new BigNumber(Balance2);
    const div = num1.div(num2);
    
    return div.toString()
}

export const BalancePlus = (Balance1: number, Balance2: number) => {
    const num1 = new BigNumber(Balance1);
    const num2 = new BigNumber(Balance2);
    const sum = num1.plus(num2);
    
    return sum.toString()
}

export const BalanceMinus = (Balance1: number, Balance2: number) => {
    const num1 = new BigNumber(Balance1);
    const num2 = new BigNumber(Balance2);
    const difference = num1.minus(num2);

    return difference.toString()
}

export const BalanceCompare = (Balance1: number, Balance2: number) => {
    const number1 = new BigNumber(Balance1)
    const number2 = new BigNumber(Balance2)
    const comparisonResult = number1.comparedTo(number2)

    return comparisonResult
}

export const sleep = (ms: number): Promise<void> => {

    return new Promise(resolve => setTimeout(resolve, ms));
}

