// ** Types
import { ReactElement, SyntheticEvent } from 'react'
import { TxRecordType } from '@/types/apps/Chivesweave'

export type LabelType = 'personal' | 'company' | 'important' | 'private'

export type FolderType = 'Inbox' | 'Sent' | 'Draft' | 'Starred' | 'Spam' | 'Trash'

export type RouteParams = {
  label: string
  initFolder: string
  type: string
}

export type DriveLayoutType = RouteParams & {}

export type MailAttachmentType = {
  url: string
  size: string
  fileName: string
  thumbnail: string
}

export type FieldMenuItems = {
  src: string
  name: string
  value: string
}

export type FetchMailParamsType = { q: string; folder: FolderType; label: LabelType }

export type PaginateMailParamsType = { dir: 'next' | 'previous'; emailId: string }

export type UpdateMailParamsType = {
  emailIds: string[] | string | []
  dataToUpdate: { folder?: FolderType; isStarred?: boolean; isRead?: boolean; label?: LabelType }
}

export type UpdateLabelType = {
  label: LabelType
  emailIds: string[] | string | []
}

export type MailFromType = {
  name: string
  email: string
  avatar: string
}

export type MailToType = {
  name: string
  email: string
}

export type MailMetaType = {
  spam: number
  inbox: number
  draft: number
}

export type MailType = {
  id: number
  message: string
  subject: string
  isRead: boolean
  to: MailToType[]
  cc: string[] | []
  isStarred: boolean
  bcc: string[] | []
  from: MailFromType
  time: Date | string
  replies: MailType[]
  hasNextMail?: boolean
  folder: FolderType
  labels: LabelType[]
  hasPreviousMail?: boolean
  attachments: MailAttachmentType[]
}

export type MailFoldersArrType = {
  icon: ReactElement
  name: FolderType
}

export type MailFoldersObjType = {
  [key: string]: any[]
}

export type MailStore = {
  data: any[] | null
  files: MailType[] | null
  selectedFiles: number[]
  currentFile: null | MailType
  mailMeta: null | MailMetaType
  filter: {
    q: string
    label: string
    folder: string
  }
}

export type DriveLabelColors = {
  personal: string
  company: string
  private: string
  important: string
}

export type MailSidebarType = {
  hidden: boolean
  store: MailStore
  lgAbove: boolean
  leftSidebarOpen: boolean
  leftSidebarWidth: number
  emailDetailWindowOpen: boolean
  toggleUploadFilesOpen: () => void
  handleLeftSidebarToggle: () => void
  setEmailDetailWindowOpen: (val: boolean) => void
}

export type EmailListType = {
  query: string
  hidden: boolean
  store: any
  lgAbove: boolean
  direction: 'ltr' | 'rtl'
  emailDetailWindowOpen: boolean
  EmailCategoriesColors: any
  folder: any
  setQuery: (val: string) => void
  currentEmail: any
  setCurrentEmail: (item: TxRecordType) => void
  setEmailDetailWindowOpen: (val: boolean) => void
  paginationModel: any
  handlePageChange: (event: any, page: number) => void
  loading: boolean
  setLoading: (val: boolean) => void
  noEmailText: string
  auth: any
  currentAoAddress: any
  counter: number
  setCounter: (id: number) => void
  setComposeOpen: (val: boolean) => void
}

export type EmailDetailType = {
  currentEmail: any
  hidden: boolean
  dispatch: any
  direction: 'ltr' | 'rtl'
  emailDetailWindowOpen: boolean
  folder: string
  labelColors: any
  folderColors: any
  folders: MailFoldersArrType[]
  foldersObj: MailFoldersObjType
  setEmailDetailWindowOpen: (val: boolean) => void
  handleStarEmail: (e: SyntheticEvent, id: string, value: boolean) => void
  handleLabelUpdate: (id: string | null, label: LabelType) => void
  handleFolderUpdate: (id: string | null, folder: FolderType) => void
  handleMoveToTrash: (id: string | null) => void
  handleMoveToSpam: (id: string | null) => void
  handleMoveToFolder: (id: string | null, oldFolder: string, newFolder: string) => void
  auth: any
  currentAoAddress: string
  EmailCategoriesColors: any
  setHaveReadEmails: any
  handleReadEmailContent: (id: string | null, folder: string) => void
  setComposeOpen: (val: boolean) => void
  setCurrentEmail: (val: any) => void
}

export type MailComposeType = {
  mdAbove: boolean
  composeOpen: boolean
  toggleComposeOpen: () => void
  composePopupWidth: string | number
  currentAoAddress: string
  auth: any
  currentEmail: any
  folder: string
}

export type Attachment = {
  fileName: string
  thumbnail: string
  url: string
  size: string
}

export type Email = {
  id: number
  from: {
    email: string
    name: string
    avatar: string
  }
  to: { name: string; email: string }[]
  subject: string
  cc: string[]
  bcc: string[]
  message: string
  attachments: Attachment[]
  isStarred: boolean
  labels: string[]
  time: Date | string
  replies: Email[]
  folder: string
  isRead: boolean
}

export type EmailType = {
  emails: Email[]
  currentEmailId?: number
}

export type EmailState = EmailType & {
  filteredEmails: Email[]
}
