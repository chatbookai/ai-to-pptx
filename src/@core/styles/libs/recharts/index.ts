// ** MUI imports
import { styled } from '@mui/material/styles'

const RechartsWrapper = styled('div')(({ theme }) => ({
  '& .recharts-cartesian-grid-vertical, & .recharts-cartesian-grid-horizontal, & .recharts-polar-grid-angle, & .recharts-polar-radius-axis, & .recharts-cartesian-axis':
    {
      '& line': {
        stroke: theme.palette.divider
      }
    },
  '& .recharts-polar-grid-concentric-polygon': {
    stroke: theme.palette.divider
  },
  '& .recharts-tooltip-wrapper': {
    outline: 'none'
  },
  '& .recharts-default-tooltip': {
    border: 'none !important',
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`
  },
  '& .recharts-custom-tooltip': {
    padding: theme.spacing(2.5),
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper
  },
  '& .recharts-tooltip-cursor': {
    fill: theme.palette.action.hover
  },
  '& .recharts-yAxis .recharts-cartesian-axis-ticks .recharts-cartesian-axis-tick .recharts-cartesian-axis-tick-value':
    {
      textAnchor: theme.direction === 'rtl' ? 'end' : undefined
    },
  '& .recharts-active-dot .recharts-dot': {
    fill: theme.palette.secondary.main
  },
  '& .recharts-tooltip-item': {
    fontSize: '0.875rem',
    color: `${theme.palette.text.primary} !important`
  },
  '& .recharts-text': {
    fontSize: '0.875rem',
    fill: theme.palette.text.disabled
  }
}))

export default RechartsWrapper
