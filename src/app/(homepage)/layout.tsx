// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Context Imports
import { IntersectionProvider } from '@/contexts/intersectionContext'
import ReactHotToast from '@/libs/styles/react-hot-toast'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@components/layout/front-pages'

import { ArweaveWalletKit } from "arweave-wallet-kit"
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'AoWallet & Arweave Wallet',
  description:
    'AoWallet & Arweave Wallet By Chives Network.'
}

const Layout = ({ children }: ChildrenType) => {
  // Vars
  const systemMode = 'light'

  return (
    <html id='__next'>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <ArweaveWalletKit
          config={{
            permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH", "ACCESS_ALL_ADDRESSES"],
            ensurePermissions: true,
            appInfo: {
              name: "AoWallet",
            },
          }}
        >
          <AuthProvider>
            <Providers direction='ltr'>
              <BlankLayout systemMode={systemMode}>
                <IntersectionProvider>
                  <FrontLayout>{children}</FrontLayout>
                </IntersectionProvider>
                <ReactHotToast>
                  <Toaster position={'top-center'} toastOptions={{ className: 'react-hot-toast' }} />
                </ReactHotToast>
              </BlankLayout>
            </Providers>
          </AuthProvider>
        </ArweaveWalletKit>
      </body>
    </html>
  )
}

export default Layout
