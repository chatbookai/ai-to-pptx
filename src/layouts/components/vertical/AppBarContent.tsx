// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import AppDownloadDropdown from 'src/@core/layouts/components/shared-components/AppDownloadDropdown'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const shortcuts: any[] = [
  {
    title: 'App Store',
    url: '/apps/calendar',
    subtitle: '打开应用链接',
    image: '/images/qrcode/ios.png',
    openUrl: 'https://apps.apple.com/cn/app/%E5%8D%95%E7%82%B9%E6%95%B0%E6%8D%AE%E4%B8%AD%E5%BF%83/id6737711443'
  },
  {
    title: 'Android Apk',
    url: '/apps/invoice/list',
    subtitle: '下载安卓安装包',
    image: '/images/qrcode/android.png',
    openUrl: 'https://fdzz.dandian.net:8443/api/download/DandianDataCenter.apk'
  }
]

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <AppDownloadDropdown settings={settings} shortcuts={shortcuts} />
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
