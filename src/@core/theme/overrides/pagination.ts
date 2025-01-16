// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const Pagination = (theme: Theme) => {
  return {
    MuiPaginationItem: {
      styleOverrides: {
        outlined: {
          borderColor: `rgba(${theme.palette.customColors.main}, 0.22)`
        },
        outlinedPrimary: {
          '&.Mui-selected': {
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.12),
            '&:hover': {
              backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.2)} !important`
            }
          }
        },
        outlinedSecondary: {
          '&.Mui-selected': {
            backgroundColor: hexToRGBA(theme.palette.secondary.main, 0.12),
            '&:hover': {
              backgroundColor: `${hexToRGBA(theme.palette.secondary.main, 0.2)} !important`
            }
          }
        }
      }
    }
  }
}

export default Pagination
