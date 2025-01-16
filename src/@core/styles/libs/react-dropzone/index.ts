// ** MUI imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

const DropzoneWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  '&.dropzone, & .dropzone': {
    minHeight: 30,
    display: 'flex',
    flexWrap: 'wrap',
    cursor: 'pointer',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.35rem',
    borderRadius: theme.shape.borderRadius,
    border: `2px dashed ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.22)' : 'rgba(247, 244, 254, 0.14)'}`,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    },
    '&:focus': {
      outline: 'none'
    },
    '& + .MuiList-root': {
      padding: 0,
      marginTop: theme.spacing(2),
      '& .MuiListItem-root': {
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(1),
        border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.14)' : 'rgba(247, 244, 254, 0.14)'}`,
        '& .file-details': {
          display: 'flex',
          alignItems: 'center'
        },
        '& .file-preview': {
          display: 'flex',
          marginRight: theme.spacing(0),
          '& svg': {
            fontSize: '2rem'
          }
        },
        '& img': {
          width: 38,
          height: 38,
          padding: theme.spacing(0.75),
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.14)' : 'rgba(247, 244, 254, 0.14)'}`
        },
        '& .file-name': {
          fontWeight: 600
        },
        '& + .MuiListItem-root': {
          marginTop: theme.spacing(2)
        }
      },
      '& + .buttons': {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(2),
        '& > :first-of-type': {
          marginRight: theme.spacing(2)
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

export default DropzoneWrapper
