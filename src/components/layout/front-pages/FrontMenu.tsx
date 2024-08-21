'use client'

// React Imports
import { useEffect } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

type Props = {
  mode: Mode
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}

type WrapperProps = {
  children: React.ReactNode
  isBelowLgScreen: boolean
  className?: string
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}

const Wrapper = (props: WrapperProps) => {
  // Props
  const { children, isBelowLgScreen, className, isDrawerOpen, setIsDrawerOpen } = props

  if (isBelowLgScreen) {
    return (
      <Drawer
        variant='temporary'
        anchor='left'
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ModalProps={{
          keepMounted: true
        }}
        sx={{ '& .MuiDrawer-paper': { width: ['100%', 300] } }}
        className={classnames('p-5', className)}
      >
        <div className='p-4 flex flex-col gap-x-3'>
          <IconButton onClick={() => setIsDrawerOpen(false)} className='absolute inline-end-4 block-start-2'>
            <i className='ri-close-line' />
          </IconButton>
          {children}
        </div>
      </Drawer>
    )
  }

  return <div className={classnames('flex items-center flex-wrap gap-x-4 gap-y-3', className)}>{children}</div>
}

const FrontMenu = (props: Props) => {
  // Props
  const { isDrawerOpen, setIsDrawerOpen } = props

  // Hooks
  const pathname = usePathname()
  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const { intersections } = useIntersection()

  useEffect(() => {
    if (!isBelowLgScreen && isDrawerOpen) {
      setIsDrawerOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBelowLgScreen])

  return (
    <Wrapper isBelowLgScreen={isBelowLgScreen} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
      <Typography
        component={Link}
        href='/home'
        className={classnames('font-medium plb-3 pli-1.5 hover:text-primary', {
          'text-primary':
            !intersections.features &&
            !intersections.team &&
            !intersections.faq &&
            !intersections['contact-us'] &&
            pathname === '/home'
        })}
        color='text.primary'
      >
        Home
      </Typography>
      <Typography
        component={Link}
        href='/pptx'
        className='font-medium plb-3 pli-1.5 hover:text-primary'
        color='text.primary'
      >
        Pptx
      </Typography>
      <Typography
        component={Link}
        href='/templates'
        className='font-medium plb-3 pli-1.5 hover:text-primary'
        color='text.primary'
      >
        Templates
      </Typography>
      <Typography
        component={Link}
        href='/pricing'
        className='font-medium plb-3 pli-1.5 hover:text-primary'
        color='text.primary'
      >
        Pricing
      </Typography>
      <Typography
        component={Link}
        href='/docs'
        className='font-medium plb-3 pli-1.5 hover:text-primary'
        color='text.primary'
      >
        Docs
      </Typography>
      <Typography
        component={Link}
        href='/feedback'
        className='font-medium plb-3 pli-1.5 hover:text-primary'
        color='text.primary'
      >
        Feedback
      </Typography>
    </Wrapper>
  )
}

export default FrontMenu
