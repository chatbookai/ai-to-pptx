
export type DriveLabelType = 'Png' | 'Jpeg' | 'Mp4' | 'Office' | 'Mp4' | 'Stl'

export type DriveFolderType = 'myfiles' | 'shared' | 'draft' | 'starred' | 'spam' | 'trash'

export type RouteParams = {
  label?: string
  initFolder?: string
  type?: string
}

export type EmailSidebarType = {
  hidden: boolean
  store: any
  lgAbove: boolean
  folder: string
  setFolder: (val: any) => void
  leftSidebarOpen: boolean
  leftSidebarWidth: number
  emailDetailWindowOpen: boolean
  composeTitle: string
  toggleComposeOpen: () => void
  handleLeftSidebarToggle: () => void
  setEmailDetailWindowOpen: (val: boolean) => void
  EmailCategoriesColors: any
}

export type BlockType = {
  id: number
  height: number
  weave_size: number
  txs_length: number
  timestamp: number
  reward_addr: string
  reward: number
  mining_time: number
  indep_hash: string
  block_size: number
}

export type TransactionType = {
  id: string
  block_indep_hash: string
  last_tx: string
  owner: string
  from_address: string
  target: string
  quantity: number
  signature: string
  reward: number
  timestamp: number
  block_height: number
  data_size: number
  bundleid: string
}

export type AddressType = {
  txs: number
  timestamp: number
  sent: number
  received: number
  lastblock: number
  id: string
  balance: number
}

export type TxRecordType = {
  id: string
  owner: {[key: string]: string}
  data: {[key: string]: any}
  fee: {[key: string]: number}
  quantity: {[key: string]: number}
  location: string
  recentActivity: string
  tags: any
  recipient: string
  block: {[key: string]: any}
  bundleid: string
  table: any
}
