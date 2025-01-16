// ** MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import MuiAppBar, { AppBarProps } from '@mui/material/AppBar'
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar'

// ** Type Imports
import { LayoutProps } from 'src/@core/layouts/types'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface Props {
  hidden: LayoutProps['hidden']
  toggleNavVisibility: () => void
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  appBarContent: NonNullable<LayoutProps['verticalLayoutProps']['appBar']>['content']
  appBarProps: NonNullable<LayoutProps['verticalLayoutProps']['appBar']>['componentProps']
}

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  transition: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 6),
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  minHeight: theme.mixins.toolbar.minHeight,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: '100%',
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  padding: `${theme.spacing(0)} !important`,
  minHeight: `${theme.mixins.toolbar.minHeight}px !important`,
  transition: 'padding .25s ease-in-out, box-shadow .25s ease-in-out, backdrop-filter .25s ease-in-out'
}))

const LayoutAppBar = (props: Props) => {
  // ** Props
  const { settings, appBarProps, appBarContent: userAppBarContent } = props

  // ** Hooks
  const theme = useTheme()
  const scrollTrigger = useScrollTrigger({ threshold: 0, disableHysteresis: true })

  // ** Vars
  const { skin, appBar, appBarBlur, contentWidth } = settings

  const appBarFixedStyles = () => {
    return {
      px: `${theme.spacing(5)} !important`,
      boxShadow: skin === 'bordered' ? 0 : 3,
      ...(appBarBlur && { backdropFilter: 'blur(8px)' }),
      backgroundColor: hexToRGBA(theme.palette.background.paper, appBarBlur ? 0.85 : 1),
      ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}`, borderTopWidth: 0 })
    }
  }

  if (appBar === 'hidden') {
    return null
  }

  let userAppBarStyle = {}
  if (appBarProps && appBarProps.sx) {
    userAppBarStyle = appBarProps.sx
  }
  const userAppBarProps = Object.assign({}, appBarProps)
  delete userAppBarProps.sx

  return (
    <AppBar
      elevation={0}
      color='default'
      className='layout-navbar'
      sx={{ ...userAppBarStyle }}
      position={appBar === 'fixed' ? 'sticky' : 'static'}
      {...userAppBarProps}
    >
      <Toolbar
        className='navbar-content-container'
        sx={{
          ...(appBar === 'fixed' && scrollTrigger && { ...appBarFixedStyles() }),
          ...(contentWidth === 'boxed' && {
            '@media (min-width:1440px)': { maxWidth: `calc(1440px - ${theme.spacing(6)} * 2)` }
          })
        }}
      >
        {(userAppBarContent && userAppBarContent(props)) || null}
      </Toolbar>
    </AppBar>
  )
}

export default LayoutAppBar
