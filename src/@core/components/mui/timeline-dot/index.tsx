// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import MuiTimelineDot from '@mui/lab/TimelineDot'

// ** Hooks Imports
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Types
import { CustomTimelineDotProps, ColorsType } from './types'

const TimelineDot = (props: CustomTimelineDotProps) => {
  // ** Props
  const { sx, skin, color, variant } = props

  // ** Hook
  const theme = useTheme()
  const bgColors: UseBgColorType = useBgColor()

  const colors: ColorsType = {
    primary: {
      boxShadow: 'none',
      color: theme.palette.primary.main,
      backgroundColor: bgColors.primaryLight.backgroundColor
    },
    secondary: {
      boxShadow: 'none',
      color: theme.palette.secondary.main,
      backgroundColor: bgColors.secondaryLight.backgroundColor
    },
    success: {
      boxShadow: 'none',
      color: theme.palette.success.main,
      backgroundColor: bgColors.successLight.backgroundColor
    },
    error: {
      boxShadow: 'none',
      color: theme.palette.error.main,
      backgroundColor: bgColors.errorLight.backgroundColor
    },
    warning: {
      boxShadow: 'none',
      color: theme.palette.warning.main,
      backgroundColor: bgColors.warningLight.backgroundColor
    },
    info: {
      boxShadow: 'none',
      color: theme.palette.info.main,
      backgroundColor: bgColors.infoLight.backgroundColor
    },
    grey: {
      boxShadow: 'none',
      color: theme.palette.grey[500],
      backgroundColor: hexToRGBA(theme.palette.grey[500], 0.12)
    }
  }

  return (
    <MuiTimelineDot
      {...props}
      sx={color && skin === 'light' && variant === 'filled' ? Object.assign(colors[color], sx) : sx}
    />
  )
}

TimelineDot.defaultProps = {
  color: 'grey',
  variant: 'filled'
}

export default TimelineDot
