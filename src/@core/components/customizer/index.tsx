// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** MUI Imports
import Radio from '@mui/material/Radio'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

const Toggler = styled(Box)<BoxProps>(({ theme }) => ({
  right: 0,
  top: '50%',
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  padding: theme.spacing(2),
  zIndex: theme.zIndex.modal,
  transform: 'translateY(-50%)',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius
}))

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

const CustomizerSpacing = styled('div')(({ theme }) => ({
  padding: theme.spacing(5, 6)
}))

const ColorBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(0, 1.5),
  color: theme.palette.common.white,
  transition: 'box-shadow .25s ease',
  borderRadius: theme.shape.borderRadius
}))

const Customizer = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)

  // ** Hook
  const { settings, saveSettings } = useSettings()

  // ** Vars
  const {
    appBar,
    footer,
    layout,
    navHidden,
    appBarBlur,
    themeColor,
    navCollapsed,
    contentWidth,
    verticalNavToggleType
  } = settings

  const handleChange = (field: keyof Settings, value: Settings[keyof Settings]): void => {
    saveSettings({ ...settings, [field]: value })
  }

  return (
    <div className='customizer'>
      <Toggler className='customizer-toggler' onClick={() => setOpen(true)}>
        <Icon icon='mdi:cog-outline' fontSize={20} />
      </Toggler>
      <Drawer open={open} hideBackdrop anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: (theme: any) => theme.spacing(3.5, 5),
            borderBottom: (theme: any) => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
          主题自定义
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>自定义设置主题和界面</Typography>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'text.secondary',
              transform: 'translateY(-50%)'
            }}
          >
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              主题化
            </Typography>

            {/* Skin */}
            <Box sx={{ mb: 4 }}>
              <Typography>皮肤</Typography>
              <RadioGroup
                row
                value={settings['skin']}
                onChange={e => handleChange('skin', e.target.value as Settings['skin'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='default' label='默认' control={<Radio />} />
                <FormControlLabel value='bordered' label='边线' control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* Mode */}
            <Box sx={{ mb: 4 }}>
              <Typography>模式</Typography>
              <RadioGroup
                row
                value={settings['mode']}
                onChange={e => handleChange('mode', e.target.value as any)}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='light' label='明亮' control={<Radio />} />
                <FormControlLabel value='dark' label='暗色' control={<Radio />} />
                {layout === 'horizontal' ? null : (
                  <FormControlLabel value='semi-dark' label='左暗右亮' control={<Radio />} />
                )}
              </RadioGroup>
            </Box>

            {/* Color Picker */}
            <div>
              <Typography sx={{ mb: 2.5 }}>主要颜色</Typography>
              <Box sx={{ display: 'flex' }}>
                <ColorBox
                  onClick={() => handleChange('themeColor', 'primary')}
                  sx={{
                    ml: 0,
                    backgroundColor: '#9155FD',
                    ...(themeColor === 'primary' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                  }}
                >
                  {themeColor === 'primary' ? <Icon icon='mdi:check' fontSize={20} /> : null}
                </ColorBox>
                <ColorBox
                  onClick={() => handleChange('themeColor', 'secondary')}
                  sx={{
                    backgroundColor: 'secondary.main',
                    ...(themeColor === 'secondary' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                  }}
                >
                  {themeColor === 'secondary' ? <Icon icon='mdi:check' fontSize={20} /> : null}
                </ColorBox>
                <ColorBox
                  onClick={() => handleChange('themeColor', 'success')}
                  sx={{
                    backgroundColor: 'success.main',
                    ...(themeColor === 'success' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                  }}
                >
                  {themeColor === 'success' ? <Icon icon='mdi:check' fontSize={20} /> : null}
                </ColorBox>
                <ColorBox
                  onClick={() => handleChange('themeColor', 'error')}
                  sx={{
                    backgroundColor: 'error.main',
                    ...(themeColor === 'error' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                  }}
                >
                  {themeColor === 'error' ? <Icon icon='mdi:check' fontSize={20} /> : null}
                </ColorBox>
                <ColorBox
                  onClick={() => handleChange('themeColor', 'warning')}
                  sx={{
                    backgroundColor: 'warning.main',
                    ...(themeColor === 'warning' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                  }}
                >
                  {themeColor === 'warning' ? <Icon icon='mdi:check' fontSize={20} /> : null}
                </ColorBox>
                <ColorBox
                  onClick={() => handleChange('themeColor', 'info')}
                  sx={{
                    mr: 0,
                    backgroundColor: 'info.main',
                    ...(themeColor === 'info' ? { boxShadow: 9 } : { '&:hover': { boxShadow: 4 } })
                  }}
                >
                  {themeColor === 'info' ? <Icon icon='mdi:check' fontSize={20} /> : null}
                </ColorBox>
              </Box>
            </div>
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              布局
            </Typography>

            {/* Content Width */}
            <Box sx={{ mb: 4 }}>
              <Typography>内容宽度</Typography>
              <RadioGroup
                row
                value={contentWidth}
                onChange={e => handleChange('contentWidth', e.target.value as Settings['contentWidth'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='full' label='全部' control={<Radio />} />
                <FormControlLabel value='boxed' label='边框' control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* AppBar */}
            <Box sx={{ mb: 4 }}>
              <Typography>应用栏类型</Typography>
              <RadioGroup
                row
                value={appBar}
                onChange={e => handleChange('appBar', e.target.value as Settings['appBar'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='fixed' label='固定' control={<Radio />} />
                <FormControlLabel value='static' label='静态' control={<Radio />} />
                {layout === 'horizontal' ? null : (
                  <FormControlLabel value='hidden' label='隐藏' control={<Radio />} />
                )}
              </RadioGroup>
            </Box>

            {/* Footer */}
            <Box sx={{ mb: 4 }}>
              <Typography>底部布局</Typography>
              <RadioGroup
                row
                value={footer}
                onChange={e => handleChange('footer', e.target.value as Settings['footer'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='fixed' label='固定' control={<Radio />} />
                <FormControlLabel value='static' label='静态' control={<Radio />} />
                <FormControlLabel value='hidden' label='隐藏' control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* AppBar Blur */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>应用栏模糊</Typography>
              <Switch
                name='appBarBlur'
                checked={appBarBlur}
                onChange={e => handleChange('appBarBlur', e.target.checked)}
              />
            </Box>

          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              菜单
            </Typography>

            {/* Menu Toggle */}
            {navHidden || layout === 'horizontal' ? null : (
              <Box sx={{ mb: 4 }}>
                <Typography>菜单切换</Typography>
                <RadioGroup
                  row
                  value={verticalNavToggleType}
                  onChange={e =>
                    handleChange('verticalNavToggleType', e.target.value as Settings['verticalNavToggleType'])
                  }
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
                >
                  <FormControlLabel value='accordion' label='手风琴' control={<Radio />} />
                  <FormControlLabel value='collapse' label='菜单折叠' control={<Radio />} />
                </RadioGroup>
              </Box>
            )}

            {/* Menu Collapsed */}
            {navHidden || layout === 'horizontal' ? null : (
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>菜单折叠</Typography>
                <Switch
                  name='navCollapsed'
                  checked={navCollapsed}
                  onChange={e => handleChange('navCollapsed', e.target.checked)}
                />
              </Box>
            )}

            {/* Menu Hidden */}
            {layout === 'horizontal' && appBar === 'hidden' ? null : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>菜单隐藏</Typography>
                <Switch
                  name='navHidden'
                  checked={navHidden}
                  onChange={e => handleChange('navHidden', e.target.checked)}
                />
              </Box>
            )}
          </CustomizerSpacing>
        </PerfectScrollbar>
      </Drawer>
    </div>
  )
}

export default Customizer
