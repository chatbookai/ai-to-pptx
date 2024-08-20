
// ** Third Party Imports
import axios from 'axios'
import authConfig from '../configs/auth'

export async function GetArWalletAllTxs(Address: string, Type: string, After: any) {
    console.log("After", After)
    const query = 
        `query getTransactions(
            $ids: [ID!], 
            $owners: [String!], 
            $recipients: [String!], 
            $tags: [TagFilter!], 
            $bundledIn: [ID!], 
            $block: BlockFilter, 
            $first: Int = 2000, 
            $after: String, 
            $sort: SortOrder = HEIGHT_DESC
            ) {
                transactions(
                    ids: $ids
                    owners: $owners
                    recipients: $recipients
                    tags: $tags
                    bundledIn: $bundledIn
                    block: $block
                    first: $first
                    after: $after
                    sort: $sort
                ) {
                    pageInfo {
                        hasNextPage
                    }
                    edges {
                        cursor
                        node {
                            id
                            block {
                                height
                                id
                                timestamp
                            }
                            recipient
                                owner {
                                address
                                key
                            }
                            fee {
                                winston
                                ar
                            }
                            quantity {
                                winston
                                ar
                            }
                            tags {
                                name
                                value
                            }
                            data {
                                size
                                type
                            }
                            bundledIn {
                                id
                            }
                        }
                    }
                }
            }
            `

    try {
        if(Type == "Sent")  {
            const res = await axios.post(authConfig.backEndApi + '/graphql', { query, operationName: "getTransactions", variables: {
                owners: [Address], after: After['Sent'] ?? ''
            } }).then(res=>res.data);
            if(res && res.data && res.data.transactions) {
                const lastTx = res.data.transactions.edges.pop()

                return { data: res.data.transactions.edges, [Type]: lastTx?.cursor ?? '', pageInfo: res.data.transactions.pageInfo  }
            }
        }
        if(Type == "Received")  {
            const res = await axios.post(authConfig.backEndApi + '/graphql', { query, operationName: "getTransactions", variables: {
                recipients: [Address], after: After['Received'] ?? ''
            } }).then(res=>res.data);
            if(res && res.data && res.data.transactions) {
                const lastTx = res.data.transactions.edges.pop()
                
                return { data: res.data.transactions.edges, [Type]: lastTx?.cursor ?? '', pageInfo: res.data.transactions.pageInfo }
            }
        }
    } 
    catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

export function urlToSettings (url: string) {
    const obj = new URL(url)
    const protocol = obj.protocol.replace(':', '')
    const host = obj.hostname
    const port = obj.port ? parseInt(obj.port) : protocol === 'https' ? 443 : 80
    
    return { protocol, host, port }
};