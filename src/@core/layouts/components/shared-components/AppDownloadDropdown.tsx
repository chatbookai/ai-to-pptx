// ** React Imports
import { useState, SyntheticEvent, Fragment, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'

import { authConfig  } from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

const TrophyImg = styled('img')({
  height: 110
})


interface Props {
  settings: Settings
  shortcuts: any[]
}

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 350,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: '30rem'
})

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: '30rem', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const AppDownloadDropdown = (props: Props) => {
  // ** Props
  const { shortcuts, settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Icon icon='bx:mobile' />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontSize: '1.125rem', color: 'text.secondary', fontWeight: 600 }}>手机端下载</Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ my: '0 !important' }} />
        <ScrollWrapper hidden={hidden}>
          <Grid
            container
            spacing={0}
            sx={{
              '& .MuiGrid-root': {
                borderBottom: (theme: any) => `1px solid ${theme.palette.divider}`,
                '&:nth-of-type(odd)': { borderRight: (theme: any) => `1px solid ${theme.palette.divider}` }
              }
            }}
          >
            {shortcuts.map(shortcut => (
              <Grid
                item
                xs={6}
                key={shortcut.title}
              >
                <Box
                  sx={{
                    p: 6,
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    textDecoration: 'none',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <TrophyImg src={shortcut.image} />
                  <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{shortcut.title}</Typography>
                  <Typography variant='body2' onClick={()=>{
                    handleDropdownClose();
                    window.open(shortcut.openUrl, '_blank');
                  }} sx={{ color: 'text.disabled', cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                    {shortcut.subtitle}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </ScrollWrapper>
        <Divider sx={{ my: '0 !important' }} />
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 600 }}>手机端用户名: 您的用户名@{authConfig.AppMarkId}</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default AppDownloadDropdown
