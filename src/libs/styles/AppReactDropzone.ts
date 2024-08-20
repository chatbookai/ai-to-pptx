'use client'

// MUI imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// Type imports
import type { BoxProps } from '@mui/material/Box'

// Styled Components
const AppReactDropzone = styled(Box)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 300,
    display: 'flex',
    flexWrap: 'wrap',
    cursor: 'pointer',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    border: '2px dashed var(--mui-palette-divider)',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    },
    '&:focus': {
      outline: 'none'
    },
    '& + .MuiList-root': {
      padding: 0,
      marginTop: theme.spacing(6.25),
      '& .MuiListItem-root': {
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2.5, 2.4, 2.5, 6),
        border: '1px solid var(--mui-palette-divider)',
        '& .file-details': {
          display: 'flex',
          alignItems: 'center'
        },
        '& .file-preview': {
          display: 'flex',
          marginRight: theme.spacing(3.75),
          '& svg': {
            fontSize: '2rem'
          }
        },
        '& img': {
          width: 38,
          height: 38,
          padding: theme.spacing(0.75),
          borderRadius: theme.shape.borderRadius,
          border: '1px solid var(--mui-palette-divider)'
        },
        '& .file-name': {
          fontWeight: 600
        },
        '& + .MuiListItem-root': {
          marginTop: theme.spacing(3.5)
        }
      },
      '& + .buttons': {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(6.25),
        '& > :first-of-type': {
          marginRight: theme.spacing(3.5)
        }
      }
    },
    '& img.single-file-image': {
      objectFit: 'cover',
      position: 'absolute',
      width: 'calc(100% - 1rem)',
      height: 'calc(100% - 1rem)',
      borderRadius: theme.shape.borderRadius
    }
  }
}))

export default AppReactDropzone
