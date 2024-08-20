'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import FrontMenu from './FrontMenu'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'
import { ConnectButton } from "arweave-wallet-kit"

// Styles Imports
import styles from '@components/layout/front-pages/styles.module.css'

const Header = ({ mode }: { mode: Mode }) => {
  // States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Hooks
  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  // Detect window scroll
  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true
  })

  return (
    <header className={classnames(frontLayoutClasses.header, styles.header)}>
      <div className={classnames(frontLayoutClasses.navbar, styles.navbar, { [styles.headerScrolled]: trigger })}>
        <div className={classnames(frontLayoutClasses.navbarContent, styles.navbarContent)}>
          <div className='flex items-center gap-4'>
            <Link href='/'>
              <Logo />
            </Link>            
            {!isBelowLgScreen && (
              <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
            )}
            {isBelowLgScreen && (
              <Typography
                component={Link}
                href='https://web.aowallet.org'
                target='_blank'
                className={classnames('font-medium plb-3 pli-1.5 hover:text-primary', {
                  'text-primary': true
                })}
                color='text.primary'
              >
                WebWallet
              </Typography>
            )}
          </div>
          <div className='flex items-center sm:gap-4'>
            <ModeDropdown />
            {!isBelowLgScreen && (
              <Box sx={{ display: 'flex', alignItems: 'center', my: 0 }}>
                <ConnectButton
                  accent="#9155FD"
                  profileModal={true}
                  showBalance={true}
                  showProfilePicture={true}
                />
              </Box>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
