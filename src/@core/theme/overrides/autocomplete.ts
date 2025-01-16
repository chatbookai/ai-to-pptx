// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Theme Type Import
import { Skin } from 'src/@core/layouts/types'

const Autocomplete = (theme: Theme, skin: Skin) => {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          ...(skin === 'bordered' && { boxShadow: 'none', border: `1px solid ${theme.palette.divider}` })
        }
      }
    }
  }
}

export default Autocomplete
