import type { ACLObj } from 'src/configs/acl'
import type { ReactElement, ReactNode } from 'react'
import type { NextComponentType, NextPageContext } from 'next/dist/shared/lib/utils'

declare module 'next' {
  export declare type NextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P> & {
    acl?: ACLObj
    authGuard?: boolean
    guestGuard?: boolean
    setConfig?: () => void
    contentHeightFixed?: boolean
    getLayout?: (page: ReactElement) => ReactNode
  }
}
