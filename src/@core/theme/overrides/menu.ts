// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Theme Type Import
import { Skin } from 'src/@core/layouts/types'

const Menu = (theme: Theme, skin: Skin) => {
  const boxShadow = () => {
    if (skin === 'bordered') {
      return theme.shadows[0]
    } else if (theme.palette.mode === 'light') {
      return theme.shadows[8]
    } else return theme.shadows[9]
  }

  return {
    MuiMenu: {
      styleOverrides: {
        root: {
          '& .MuiMenu-paper': {
            borderRadius: 5,
            boxShadow: boxShadow(),
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }
        }
      }
    }
  }
}

export default Menu
