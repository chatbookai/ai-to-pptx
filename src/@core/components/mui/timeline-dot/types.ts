// ** MUI Imports
import { TimelineDotProps } from '@mui/lab/TimelineDot'

export type CustomTimelineDotProps = TimelineDotProps & { skin?: 'light' }

export type ColorsType = {
  [key: string]: {
    color: string
    boxShadow: string
    backgroundColor: string
  }
}
