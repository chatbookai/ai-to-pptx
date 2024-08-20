// React Imports
import { Fragment, useEffect, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'

// Third-party Imports
import classnames from 'classnames'
import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  useHover,
  offset,
  flip,
  size,
  autoUpdate,
  FloatingPortal,
  safePolygon,
  useTransitionStyles
} from '@floating-ui/react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Link from '@components/Link'
import CustomAvatar from '@/@core/components/mui/avatar2'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

type Props = {
  mode: Mode
  isBelowLgScreen: boolean
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}

type MenuWrapperProps = {
  children: ReactNode
  refs: any
  isBelowLgScreen: boolean
  isOpen: boolean
  getFloatingProps: any
  top: number
  floatingStyles: CSSProperties
  isMounted: boolean
  styles: CSSProperties
}

// Constants
const pageData = [
  {
    title: 'Pricing',
    href: '/pricing'
  },
  {
    title: 'Payment',
    href: '/payment'
  },
  {
    title: 'Checkout',
    href: '/checkout'
  },
  {
    title: 'Help Center',
    href: '/help-center'
  }
]

const authData = [
  {
    title: 'Login (Basic)',
    href: '/login-v1'
  },
  {
    title: 'Login (Cover)',
    href: '/login-v2'
  },
  {
    title: 'Register (Basic)',
    href: '/register-v1'
  },
  {
    title: 'Register (Cover)',
    href: '/register-v2'
  },
  {
    title: 'Register (Multi-steps)',
    href: '/register-multi-steps'
  },
  {
    title: 'Forgot Password (Basic)',
    href: '/forgot-password-v1'
  },
  {
    title: 'Forgot Password (Cover)',
    href: '/forgot-password-v2'
  },
  {
    title: 'Reset Password (Basic)',
    href: '/reset-password-v1'
  },
  {
    title: 'Reset Password (Cover)',
    href: '/reset-password-v2'
  }
]

const othersData = [
  {
    title: 'Under Maintenance',
    href: '/misc/under-maintenance'
  },
  {
    title: 'Coming Soon',
    href: '/misc/coming-soon'
  },
  {
    title: 'Not Authorized',
    href: '/misc/401-not-authorized'
  },
  {
    title: 'Verify Email (Basic)',
    href: '/auth/verify-email-v1'
  },
  {
    title: 'Verify Email (Cover)',
    href: '/auth/verify-email-v2'
  },
  {
    title: 'Two Steps (Basic)',
    href: '/auth/two-steps-v1'
  },
  {
    title: 'Two Steps (Cover)',
    href: '/auth/two-steps-v2'
  }
]

const MenuWrapper = (props: MenuWrapperProps) => {
  // Props
  const { children, refs, isBelowLgScreen, isOpen, getFloatingProps, top, floatingStyles, isMounted, styles } = props

  if (!isBelowLgScreen) {
    return (
      <FloatingPortal>
        {isMounted && (
          <div ref={refs.setFloating} className='z-[1201] lg:z-[11]' {...getFloatingProps()} style={floatingStyles}>
            <div
              className='flex gap-8 p-8'
              style={{
                ...styles,
                overflowY: 'auto',
                background: 'var(--mui-palette-background-paper)',
                minWidth: 100,
                borderRadius: 'var(--mui-shape-borderRadius)',
                outline: 0,
                boxShadow: 'var(--mui-shadows-3)',
                maxBlockSize: `calc((var(--vh, 1vh) * 100) - ${top}px)`
              }}
            >
              {children}
            </div>
          </div>
        )}
      </FloatingPortal>
    )
  }

  return (
    <Collapse in={isOpen}>
      <div className='flex flex-col gap-6 mbs-3'>{children}</div>
    </Collapse>
  )
}

const DropdownMenu = (props: Props) => {
  // Props
  const { isBelowLgScreen, isDrawerOpen, setIsDrawerOpen, mode } = props

  // states
  const [isOpen, setIsOpen] = useState(false)

  // Vars
  const dropdownImageLight = '/images/front-pages/dropdown-image-light.png'
  const dropdownImageDark = '/images/front-pages/dropdown-image-dark.png'

  // hooks
  const pathname = usePathname()
  const dropdownImage = useImageVariant(mode, dropdownImageLight, dropdownImageDark)

  const { y, refs, floatingStyles, context } = useFloating<HTMLElement>({
    placement: 'bottom',
    open: isOpen,
    ...(!isBelowLgScreen && { onOpenChange: setIsOpen }),
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(14),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            minWidth: `${rects.reference.width}px`
          })
        },
        padding: 10
      })
    ]
  })

  // Floating UI Transition Styles
  const { isMounted, styles } = useTransitionStyles(context, {
    // Configure both open and close durations:
    duration: 300,

    initial: {
      opacity: 0,
      transform: 'translateY(10px)'
    },
    open: {
      opacity: 1,
      transform: 'translateY(0px)'
    },
    close: {
      opacity: 0,
      transform: 'translateY(10px)'
    }
  })

  const hover = useHover(context, {
    handleClose: safePolygon({
      blockPointerEvents: true
    }),
    restMs: 25,
    delay: { open: 75 }
  })

  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'menu' })

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role, hover])

  const Tag = isBelowLgScreen ? 'div' : Fragment

  const handleLinkClick = () => {
    if (isBelowLgScreen) {
      isDrawerOpen && setIsDrawerOpen(false)
    } else {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (!isDrawerOpen && isOpen) {
      setIsOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen])

  return (
    <Tag {...(isBelowLgScreen && { className: 'flex flex-col' })}>
      <Typography
        color='text.primary'
        component={Link}
        className={classnames('flex items-center gap-2 font-medium plb-3 pli-1.5 hover:text-primary', {
          'text-primary':
            pathname === '/home/payment' ||
            pathname === '/home/pricing' ||
            pathname === '/front-pages/checkout' ||
            pathname === '/front-pages/help-center' ||
            pathname === '/front-pages/help-center/article/how-to-add-product-in-cart'
        })}
        {...(isBelowLgScreen
          ? {
              onClick: (e: MouseEvent) => {
                e.preventDefault()
                setIsOpen(!isOpen)
              }
            }
          : {
              ref: refs.setReference,
              ...getReferenceProps()
            })}
      >
        <span>Pages</span>
        <i
          className={classnames(
            {
              'ri-arrow-down-s-line': !isBelowLgScreen || (isBelowLgScreen && !isOpen),
              'ri-arrow-up-s-line': isBelowLgScreen && isOpen
            },
            'text-xl'
          )}
        />
      </Typography>
      <MenuWrapper
        refs={refs}
        isBelowLgScreen={isBelowLgScreen}
        isOpen={isOpen}
        getFloatingProps={getFloatingProps}
        top={y ? y - window.scrollY : 0}
        floatingStyles={floatingStyles}
        isMounted={isMounted}
        styles={styles}
      >
        <div className='flex flex-col gap-4'>
          <div className='flex gap-3 items-center'>
            <CustomAvatar variant='rounded' color='primary' skin='light'>
              <i className='ri-grid-line' />
            </CustomAvatar>
            <Typography variant='h6'>Page</Typography>
          </div>
          {pageData.map((page, index) => (
            <Link
              key={index}
              href={'/front-pages' + page.href}
              className={classnames('flex items-center gap-3 focus:outline-none hover:text-primary', {
                'text-primary': pathname.includes('/front-pages' + page.href)
              })}
              onClick={handleLinkClick}
            >
              <i className='ri-circle-line text-[10px]' />
              <span>{page.title}</span>
            </Link>
          ))}
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-3 items-center'>
            <CustomAvatar variant='rounded' color='primary' skin='light'>
              <i className='ri-lock-line' />
            </CustomAvatar>
            <Typography variant='h6'>Auth Demo</Typography>
          </div>
          {authData.map((page, index) => (
            <Link
              key={index}
              href={'/pages/auth' + page.href}
              target='_blank'
              className='flex items-center gap-3 hover:text-primary'
              onClick={handleLinkClick}
            >
              <i className='ri-circle-line text-[10px]' />
              <span>{page.title}</span>
            </Link>
          ))}
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-3'>
            <CustomAvatar variant='rounded' color='primary' skin='light'>
              <i className='ri-image-line' />
            </CustomAvatar>
            <Typography variant='h6'>Auth Demo</Typography>
          </div>
          {othersData.map((page, index) => (
            <Link
              key={index}
              href={'/pages' + page.href}
              target='_blank'
              className='flex items-center gap-3 hover:text-primary'
              onClick={handleLinkClick}
            >
              <i className='ri-circle-line text-[10px]' />
              <span>{page.title}</span>
            </Link>
          ))}
        </div>
        {!isBelowLgScreen && (
          <div>
            <img src={dropdownImage} alt='dropdown image' className='rounded' />
          </div>
        )}
      </MenuWrapper>
    </Tag>
  )
}

export default DropdownMenu
