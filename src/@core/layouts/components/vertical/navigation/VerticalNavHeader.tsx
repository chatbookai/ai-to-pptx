// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

interface Props {
  navHover: boolean
  collapsedNavWidth: number
  hidden: LayoutProps['hidden']
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  navMenuBranding?: LayoutProps['verticalLayoutProps']['navMenu']['branding']
  menuLockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['lockedIcon']
  menuUnlockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['unlockedIcon']
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const StyledLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    navMenuBranding: userNavMenuBranding,
    menuUnlockedIcon: userMenuUnlockedIcon
  } = props

  // ** Hooks & Vars
  const theme = useTheme()
  const { navCollapsed } = settings

  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 30) / 8
      }
    } else {
      return 6
    }
  }

  const MenuLockedIcon = () => userMenuLockedIcon || <Icon icon='mdi:radiobox-marked' />

  const MenuUnlockedIcon = () => userMenuUnlockedIcon || <Icon icon='mdi:radiobox-blank' />

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: menuHeaderPaddingLeft() }}>
      {userNavMenuBranding ? (
        userNavMenuBranding(props)
      ) : (
        <StyledLink href='/'>
          <svg
            width={30}
            height={25}
            version='1.1'
            viewBox='0 0 30 23'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
          >
            <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                <g id='logo' transform='translate(95.000000, 50.000000)'>
                  <path
                    id='Combined-Shape'
                    fill={theme.palette.primary.main}
                    d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                  />
                  <polygon
                    id='Rectangle'
                    opacity='0.077704'
                    fill={theme.palette.common.black}
                    points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                  />
                  <polygon
                    id='Rectangle'
                    opacity='0.077704'
                    fill={theme.palette.common.black}
                    points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                  />
                  <polygon
                    id='Rectangle'
                    opacity='0.077704'
                    fill={theme.palette.common.black}
                    points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                    transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                  />
                  <polygon
                    id='Rectangle'
                    opacity='0.077704'
                    fill={theme.palette.common.black}
                    points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                    transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                  />
                  <path
                    id='Rectangle'
                    fillOpacity='0.15'
                    fill={theme.palette.common.white}
                    d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                  />
                  <path
                    id='Rectangle'
                    fillOpacity='0.35'
                    fill={theme.palette.common.white}
                    transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                    d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                  />
                </g>
              </g>
            </g>
          </svg>
          <HeaderTitle variant='h6' sx={{ ...menuCollapsedStyles, ...(navCollapsed && !navHover ? {} : { ml: 3 }) }}>
            {themeConfig.templateName}
          </HeaderTitle>
        </StyledLink>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{ p: 0, backgroundColor: 'transparent !important' }}
        >
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      ) : userMenuLockedIcon === null && userMenuUnlockedIcon === null ? null : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
          sx={{
            p: 0,
            color: 'text.primary',
            backgroundColor: 'transparent !important',
            '& svg': {
              fontSize: '1.25rem',
              ...menuCollapsedStyles,
              transition: 'opacity .25s ease-in-out'
            }
          }}
        >
          {navCollapsed ? MenuUnlockedIcon() : MenuLockedIcon()}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
