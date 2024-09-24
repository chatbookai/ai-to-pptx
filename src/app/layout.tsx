// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

import authConfig from '@configs/auth'

export const metadata = {
  title: authConfig.AppName,
  description: authConfig.AppDesc
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars

  return (
    <html id='__next' lang='en' dir='ltr'>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}

export default RootLayout
