// ** MUI Imports
import { Theme } from '@mui/material/styles'

const Divider = (theme: Theme) => {
  return {
    MuiDivider: {
      styleOverrides: {
        root: {
          '&:not(.MuiDivider-vertical)': {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
          }
        },
        middle: {
          '&:not(.MuiDivider-vertical)': {
            marginLeft: theme.spacing(5),
            marginRight: theme.spacing(5)
          },
          '&.MuiDivider-vertical': {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
          }
        }
      }
    }
  }
}

export default Divider
