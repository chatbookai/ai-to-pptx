// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Theme Type Import
import { Skin } from 'src/@core/layouts/types'

const Popover = (theme: Theme, skin: Skin) => {
  return {
    MuiPopover: {
      styleOverrides: {
        root: {
          '& .MuiPopover-paper': {
            boxShadow: theme.shadows[skin === 'bordered' ? 0 : 6],
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }
        }
      }
    }
  }
}

export default Popover
