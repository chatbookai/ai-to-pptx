import { AoGetPageRecords } from './AoConnect'
import { ansiRegex } from '../../configs/functions'

const AoConnectLocalStorage = 'AoConnectDb'
const AoConnectLastCursor = 'AoConnectLastCursor'
const AoConnectReminderProcessTxId = 'AoConnectReminderProcessTxId'
const AoConnectMyAoConnectTxId = 'AoConnectMyAoConnectTxId'
const AoConnectMembers = 'AoConnectMembers'
const AoConnectChannels = 'AoConnectChannels'
const AoConnectEveryTimeGetMsgCount = 10

export const SetAoConnectMembers = (Address: string, Members: any) => {
    const JsonDataText: string = window.localStorage.getItem(AoConnectMembers) ?? "{}"
    const JsonData = JSON.parse(JsonDataText)
    JsonData[Address] = Members
    window.localStorage.setItem(AoConnectMembers, JSON.stringify(JsonData))

    return Members
}

export const GetAoConnectMembers = (Address: string) => {
    const JsonDataText: string = window.localStorage.getItem(AoConnectMembers) ?? "{}"
    try{
        const JsonData = JSON.parse(JsonDataText)

        return JsonData[Address] ?? [[], {}, {}]
    }
    catch(Error: any) {

        return [[], {}, {}]
    }
}

export const SetAoConnectChannels = (Address: string, Channels: any) => {
    const JsonDataText: string = window.localStorage.getItem(AoConnectChannels) ?? "{}"
    const JsonData = JSON.parse(JsonDataText)
    JsonData[Address] = Channels
    window.localStorage.setItem(AoConnectChannels, JSON.stringify(JsonData))

    return Channels
}

export const GetAoConnectChannels = (Address: string) => {
    const JsonDataText: string = window.localStorage.getItem(AoConnectChannels) ?? "{}"
    try{
        const JsonData = JSON.parse(JsonDataText)

        return JsonData[Address] ?? {}
    }
    catch(Error: any) {

        return {}
    }
}

export const SetAoConnectMyAoConnectTxId = (Address: string, chatroomTxId: string) => {
    const JsonDataText: string = window.localStorage.getItem(AoConnectMyAoConnectTxId) ?? "{}"
    const JsonData = JSON.parse(JsonDataText)
    JsonData[Address] = chatroomTxId
    window.localStorage.setItem(AoConnectMyAoConnectTxId, JSON.stringify(JsonData))

    return chatroomTxId
}

export const GetAoConnectMyAoConnectTxId = (Address: string) => {
    const JsonDataText: string = window.localStorage.getItem(AoConnectMyAoConnectTxId) ?? "{}"
    const JsonData = JSON.parse(JsonDataText)
    
    return JsonData[Address] ?? ''
}

export const SetAoConnectReminderProcessTxId = (processTxId: string) => {
    window.localStorage.setItem(AoConnectReminderProcessTxId, processTxId)

    return window.localStorage.getItem(AoConnectReminderProcessTxId) ?? ''
}

export const GetAoConnectReminderProcessTxId = () => {

    return window.localStorage.getItem(AoConnectReminderProcessTxId) ?? ''
}

export const ReminderMsgAndStoreToLocal = async (processTxId: string, reminder = true) => {
    
    const AoConnectLastCursorData = window.localStorage.getItem(AoConnectLastCursor + "_" + processTxId) || undefined
    const AoGetPageRecordsList: any = await AoGetPageRecords(processTxId, 'DESC', AoConnectEveryTimeGetMsgCount, AoConnectLastCursorData);
    const NeedReminderMsg: any[] = []
    const NeedSaveMsg: any[] = []

    AoGetPageRecordsList && AoGetPageRecordsList.edges && AoGetPageRecordsList.edges.map((item: any, index: number)=>{

        if(index == 0 && item.cursor) {
            window.localStorage.setItem(AoConnectLastCursor + "_" + processTxId, item.cursor)
        }

        //Output From Chatroom Msg Reminder
        if(item.node && item.node.Output && item.node.Output.data && typeof item.node.Output.data === 'string' )  {
            
            //const Data = item.node.Output.data.replace(ansiRegex, '');
            //NeedReminderMsg.push({Target: null, Action: 'Output', Type:'Reminder', From: null, Data, Ref_: null, Logo: null, Sender: null})
        }

        //Output From Chatroom Msg Reminder
        if(item.node && item.node.Output && item.node.Output.data && item.node.Output.data.output && typeof item.node.Output.data.output === 'string' )  {
            
            //const Msg = item.node.Output.data.output.replace(ansiRegex, '');            
            //NeedReminderMsg.push([Msg, ''])
        }

        //Messages
        if(item.node && item.node.Messages && typeof item.node.Messages === 'object' && item.node.Messages.length > 0)  {
            const MessagesList = item.node.Messages;
            MessagesList && MessagesList.map((ItemMsg: any)=>{
                const Data = ItemMsg?.Data?.replace(ansiRegex, '')
                const Tags = ItemMsg.Tags
                const Target = ItemMsg.Target

                if( Data || Target )   {

                    const TagsMap: any = {}
                    Tags.map((ItemTag: any)=>{
                        TagsMap[ItemTag.name] = ItemTag.value
                    })

                    const From = TagsMap['From-Process']
                    const Sender = TagsMap['Sender']
                    let Type = TagsMap['Type']
                    if(Sender) Type = "Chat"
                    const Action = TagsMap['Action']
                    const Ref_ = TagsMap['Ref_']
                    let Logo = null
                    if(Action)  {
                        Logo = "/images/apple-touch-icon.png"
                    }
                    else if(Data == 'Broadcasted.') {
                        Logo = "/images/apple-touch-icon.png"
                    }
                    
                    //Messages
                    if(reminder)  {
                        NeedReminderMsg.push({Target, Action, Type, From, Data, Ref_, Logo, Sender})
                    }
                    NeedSaveMsg.push({Target, Action, Type, From, Data, Ref_, Logo, Sender})

                    /*
                    const TickerList = Tags.filter((item: any)=> item.name == 'Ticker')
                    if( TickerList && TickerList.length == 1 )  {
                        const Value = TickerList[0]['value']
                        const LogoList = Tags.filter((item: any)=> item.name == 'Logo')
                        const Logo = LogoList && LogoList[0] && LogoList[0]['value'] ? LogoList[0]['value'] : null
                        const FromList = Tags.filter((item: any)=> item.name == 'From-Process')
                        const From = FromList[0]['value']
                        if(Data) {

                            //NeedReminderMsg.push([Data.replace(ansiRegex, ''), Value.replace(ansiRegex, '') + " from " + Target, Logo])
                        }
                        else {

                            //NeedReminderMsg.push([Value.replace(ansiRegex, '') + " from " + Target, From])
                        }
                    }
                    */

                }

                
                
            })
        }
        console.log("typeof item.node.Messages", typeof item.node.Messages, item.node.Messages)

    })

    //Write to LocalStorage

    console.log("ReminderMsgAndStoreToLocal NeedSaveMsg", NeedSaveMsg)
    console.log("ReminderMsgAndStoreToLocal NeedReminderMsg", NeedReminderMsg)

    return NeedReminderMsg
}

export function ConvertInboxMessageFormatAndStorage(input: string, currentAddress: string, clearDataAndRewrite: boolean) {

    // 这是一个非标准化的JSON格式, 源头是Inbox返回的结果, 需要做一下额外的处理才能转换为JSON对像
    // This is a non-standardized JSON format. The source is the result returned by Inbox. Additional processing is required to convert it into a JSON object.

    // 去除最外层的一对{},并且替换为[] Remove the outermost pair of {} and replace it with []
    let adjustedData = "["+ input.replace(/\s+/g, ' ').trim().slice(1, -1) + "]";

    // 将键值对中的键加上双引号 Enclose the key in the key-value pair in double quotes
    adjustedData = adjustedData.replace(/(\w[\w-]*)\s*=\s*/g, '"$1": ')

    // 将外层的大括号转换为标准 JSON 格式 Convert outer braces to standard JSON format
    adjustedData = adjustedData.replace(/:\s*\{\s*\{/g, ': [ {')
                               .replace(/\}\s*\},/g, '} ],')
                               .replace(/\}\s*\}/g, '} ]');


    try {
        
        const InboxMsgMap: any = { Chat:{}, Message: {}, Process: {} }

        const InboxMsgList = JSON.parse(adjustedData);

        const InboxMsgListNew = InboxMsgList.map((Item: any, Index: number)=>{

            return {...Item, id: Index}
        })
        InboxMsgListNew.map((ItemMsg: any)=>{
            let Type = ItemMsg?.Tags?.Type
            if(ItemMsg.Sender) {
                Type = "Chat"
            }
            const Ref_ = ItemMsg?.Tags?.Ref_ ?? ItemMsg.Timestamp
            if(InboxMsgMap[Type] == undefined) {
                InboxMsgMap[Type] = {}
            }
            const KeyValue = ItemMsg && ItemMsg.NanoId ? ItemMsg.NanoId : String(ItemMsg['Block-Height']) + "_" + Ref_
            InboxMsgMap[Type][KeyValue] =  {
                BlockHeight: ItemMsg['Block-Height'], 
                From: ItemMsg.From,
                Target: ItemMsg.Target,
                HashId: ItemMsg.Id,
                Timestamp: ItemMsg.Timestamp,
                Data: ItemMsg.Data,
                Type: Type,
                Ref_: ItemMsg?.Tags?.Ref_,
                Sender: ItemMsg.Sender,
                Module: ItemMsg.Module,
                NanoId: ItemMsg?.NanoId,
                Owner: ItemMsg.Owner,
                Cron: ItemMsg.Cron,
                ContentType: ItemMsg['Content-Type'], 
                HashChain: ItemMsg['Hash-Chain'], 
                ForwardedBy: ItemMsg['Forwarded-By']
            };
        })

        if(clearDataAndRewrite == false) {

            // Add data merge storage data, Not Delete Exist Data
            const Chat = window.localStorage.getItem(AoConnectLocalStorage + "_Chat_" + currentAddress) ?? ""
            if(InboxMsgMap['Chat']) {
                const ChatJson = JSON.parse(Chat)
                window.localStorage.setItem(AoConnectLocalStorage + "_Chat_" + currentAddress, JSON.stringify({...ChatJson, ...InboxMsgMap['Chat']}) )
            }
            const Message = window.localStorage.getItem(AoConnectLocalStorage + "_Message_" + currentAddress) ?? ""
            if(InboxMsgMap['Message']) {
                const MessageJson = JSON.parse(Message)
                window.localStorage.setItem(AoConnectLocalStorage + "_Message_" + currentAddress, JSON.stringify({...MessageJson, ...InboxMsgMap['Message']}) )
            }
            const Process = window.localStorage.getItem(AoConnectLocalStorage + "_Process_" + currentAddress) ?? ""
            if(InboxMsgMap['Process']) {
                const ProcessJson = JSON.parse(Process)
                window.localStorage.setItem(AoConnectLocalStorage + "_Process_" + currentAddress, JSON.stringify({...ProcessJson, ...InboxMsgMap['Process']}) )
            }
        }
        else {

            //Not save local storage data, just save the remote data
            window.localStorage.setItem(AoConnectLocalStorage + "_Chat_" + currentAddress, JSON.stringify(InboxMsgMap['Chat']) )
            window.localStorage.setItem(AoConnectLocalStorage + "_Message_" + currentAddress, JSON.stringify(InboxMsgMap['Message']) )
            window.localStorage.setItem(AoConnectLocalStorage + "_Process_" + currentAddress, JSON.stringify(InboxMsgMap['Process']) )
        }

        //console.log("ConvertInboxMessageFormatAndStorage InboxMsgMap", InboxMsgMap)

        return InboxMsgMap
    }
    catch(Error: any) {
        console.log("ConvertInboxMessageFormatAndStorage Error", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
        
        return 
    }
}

export function SaveChatRecordsToStorage(ChatRecordsData: string[], currentAddress: string, clearDataAndRewrite: boolean) {

    try {
        
        const InboxMsgMap: any = {  }

        ChatRecordsData.reverse().map((Item: any)=>{
            if(InboxMsgMap[Item.ChannelId] == undefined) {
                InboxMsgMap[Item.ChannelId] = {}
            }
            InboxMsgMap[Item.ChannelId][Item.Id] =  {
                From: Item.From,
                Id: Item.Id,
                Timestamp: Item.Timestamp,
                Content: Item.Content,
            };
        })

        if(clearDataAndRewrite == false) {
            const Chat = window.localStorage.getItem(AoConnectLocalStorage + "_Chat_" + currentAddress) ?? ""
            if(InboxMsgMap) {
                const ChatJson = JSON.parse(Chat)
                window.localStorage.setItem(AoConnectLocalStorage + "_Chat_" + currentAddress, JSON.stringify({...ChatJson, ...InboxMsgMap}) )
            }
        }
        else {
            window.localStorage.setItem(AoConnectLocalStorage + "_Chat_" + currentAddress, JSON.stringify(InboxMsgMap) )
        }

        console.log("SaveChatRecordsToStorage InboxMsgMap", InboxMsgMap)

        return InboxMsgMap
    }
    catch(Error: any) {
        console.log("SaveChatRecordsToStorage Error", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
        
        return 
    }
}

export const GetChatRecordsFromLocalStorage = (currentAddress: string, channelId: string, From: number, Counter: number) => {
    try {
        const Data: string = window.localStorage.getItem(AoConnectLocalStorage + "_Chat_" + currentAddress) ?? "{}"
        const RS = JSON.parse(Data)
        if(RS && RS[channelId]) {
            const ValuesRS = Object.values(RS[channelId])
            const LengthRS = ValuesRS.length

            return ValuesRS.slice(LengthRS - From - Counter, LengthRS - From)
        }
        else {

            return []
        }
    }
    catch(Error: any) {
        console.log("GetChatRecordsFromLocalStorage Error", Error)
        
        return []
    }
}
