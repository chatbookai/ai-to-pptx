'use client'

// MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import type { ToastContainerProps } from 'react-toastify'

// Type Imports
import type { Direction } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

type Props = ToastContainerProps & {
  boxProps?: BoxProps
  direction?: Direction
}

// Styled Components
const ToastifyWrapper = styled(Box)<BoxProps>(({ theme }) => {
  // Hooks
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down(480))

  return {
    ...(isSmallScreen && {
      '& .Toastify__toast-container': {
        marginBlockStart: theme.spacing(3),
        marginInline: theme.spacing(3),
        width: 'calc(100dvw - 1.5rem)'
      }
    }),
    '& .Toastify__toast': {
      minBlockSize: 46,
      borderRadius: 'var(--mui-shape-borderRadius)',
      padding: theme.spacing(1.5, 2.5),
      backgroundColor: 'var(--mui-palette-background-paper)',
      boxShadow: 'var(--mui-customShadows-md)',
      '[data-skin="bordered"] &': {
        boxShadow: 'none',
        border: '1px solid var(--mui-palette-divider)'
      },
      ...(isSmallScreen && {
        marginBlockEnd: theme.spacing(4)
      }),
      '&:not(.custom-toast)': {
        '& .Toastify__toast-body': {
          color: 'var(--mui-palette-text-primary)'
        },
        '&.Toastify__toast--success': {
          '& .Toastify__toast-icon svg': {
            fill: 'var(--mui-palette-success-main)'
          }
        },
        '&.Toastify__toast--error': {
          '& .Toastify__toast-icon svg': {
            fill: 'var(--mui-palette-error-main)'
          }
        },
        '&.Toastify__toast--warning': {
          '& .Toastify__toast-icon svg': {
            fill: 'var(--mui-palette-warning-main)'
          }
        },
        '&.Toastify__toast--info': {
          '& .Toastify__toast-icon svg': {
            fill: 'var(--mui-palette-info-main)'
          }
        }
      }
    },
    '& .Toastify__toast-body': {
      margin: 0,
      lineHeight: 1.467,
      fontSize: theme.typography.body1.fontSize
    },
    '& .Toastify__toast-icon': {
      marginRight: theme.spacing(3),
      height: 20,
      width: 20,
      '& .Toastify__spinner': {
        margin: 3,
        height: 14,
        width: 14
      }
    },
    '& .Toastify__close-button': {
      color: 'var(--mui-palette-text-primary)'
    }
  }
})

const AppReactToastify = (props: Props) => {
  const { boxProps, direction = 'ltr', ...rest } = props

  const positionMap: any = {
    'top-right': 'top-left',
    'top-left': 'top-right',
    'bottom-left': 'bottom-right',
    'bottom-right': 'bottom-left',
    'top-center': 'top-center',
    'bottom-center': 'bottom-center'
  }

  const position = direction === 'rtl' ? positionMap[themeConfig.toastPosition] : themeConfig.toastPosition

  return (
    <ToastifyWrapper {...boxProps}>
      <ToastContainer rtl={direction === 'rtl'} position={position} {...rest} />
    </ToastifyWrapper>
  )
}

export default AppReactToastify
