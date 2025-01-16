// ** Type Imports
import { ReactNode } from 'react'
import { AppBarProps } from '@mui/material/AppBar'
import { Theme, SxProps, PaletteMode } from '@mui/material'
import { Settings } from 'src/@core/context/settingsContext'
import { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer'

export type Layout = 'vertical' | 'horizontal' | 'blank' | 'blankWithAppBar'

export type Skin = 'default' | 'bordered'

export type Mode = PaletteMode | 'semi-dark'

export type ContentWidth = 'full' | 'boxed'

export type AppBar = 'fixed' | 'static' | 'hidden'

export type Footer = 'fixed' | 'static' | 'hidden'

export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

export type VerticalNavToggle = 'accordion' | 'collapse'

export type HorizontalMenuToggle = 'hover' | 'click'

export type BlankLayoutProps = {
  children: ReactNode
}

export type BlankLayoutWithAppBarProps = {
  children: ReactNode
}

export type NavSectionTitle = {
  action?: string
  subject?: string
  sectionTitle: string
}

export type NavGroup = {
  icon?: string
  title: string
  action?: string
  subject?: string
  badgeContent?: string
  children?: (NavGroup | NavLink)[]
  badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  allpath?: string[]
}

export type NavLink = {
  icon?: string
  path?: string
  title: string
  action?: string
  subject?: string
  disabled?: boolean
  badgeContent?: string
  externalLink?: boolean
  openInNewTab?: boolean
  badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  allpath?: string[]
}

export type VerticalNavItemsType = (NavLink | NavGroup | NavSectionTitle)[]
export type HorizontalNavItemsType = (NavLink | NavGroup)[]

export type FooterProps = {
  sx?: SxProps<Theme>
  content?: (props?: any) => ReactNode
}

export type VerticalLayoutProps = {
  appBar?: {
    componentProps?: AppBarProps
    content?: (props?: any) => ReactNode
  }
  navMenu: {
    lockedIcon?: ReactNode
    unlockedIcon?: ReactNode
    navItems?: VerticalNavItemsType
    content?: (props?: any) => ReactNode
    branding?: (props?: any) => ReactNode
    afterContent?: (props?: any) => ReactNode
    beforeContent?: (props?: any) => ReactNode
    componentProps?: Omit<SwipeableDrawerProps, 'open' | 'onOpen' | 'onClose'>
  }
}

export type HorizontalLayoutProps = {
  appBar?: {
    componentProps?: AppBarProps
    content?: (props?: any) => ReactNode
    branding?: (props?: any) => ReactNode
  }
  navMenu?: {
    sx?: SxProps<Theme>
    navItems?: HorizontalNavItemsType
    content?: (props?: any) => ReactNode
  }
}

export type LayoutProps = {
  hidden: boolean
  settings: Settings
  children: ReactNode
  footerProps?: FooterProps
  contentHeightFixed?: boolean
  scrollToTop?: (props?: any) => ReactNode
  saveSettings: (values: Settings) => void
  verticalLayoutProps: VerticalLayoutProps
  horizontalLayoutProps?: HorizontalLayoutProps
}
