// MUI Imports
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { VerticalNavState } from '@menu/contexts/verticalNavContext'

// Util Imports
import { menuClasses, verticalNavClasses } from '@menu/utils/menuClasses'

const navigationCustomStyles = (verticalNavOptions: VerticalNavState, theme: Theme) => {
  // Vars
  const { isCollapsed, isHovered, collapsedWidth, transitionDuration } = verticalNavOptions

  const collapsedHovered = isCollapsed && isHovered
  const collapsedNotHovered = isCollapsed && !isHovered

  return {
    color: 'var(--mui-palette-text-primary)',
    zIndex: 'var(--drawer-z-index) !important',
    [`& .${verticalNavClasses.header}`]: {
      paddingBlock: theme.spacing(5),
      paddingInline: theme.spacing(5.5, 4),
      ...(collapsedNotHovered && {
        paddingInline: theme.spacing(((collapsedWidth as number) - 29) / 8),
        '& a': {
          transform: `translateX(-${22 - ((collapsedWidth as number) - 29) / 2}px)`
        }
      }),
      '& a': {
        transition: `transform ${transitionDuration}ms ease`
      }
    },
    [`& .${verticalNavClasses.container}`]: {
      transition: theme.transitions.create(['inline-size', 'inset-inline-start', 'box-shadow'], {
        duration: transitionDuration,
        easing: 'ease-in-out'
      }),
      borderColor: 'transparent',
      ...(collapsedHovered && {
        boxShadow: 'var(--mui-customShadows-lg)'
      }),
      [`& .${verticalNavClasses.toggled}`]: {
        boxShadow: 'var(--mui-customShadows-lg)'
      },
      '[data-skin="bordered"] &': {
        borderColor: 'var(--mui-palette-divider)'
      }
    },
    [`& .${menuClasses.root}`]: {
      paddingBlockEnd: theme.spacing(2),
      ...(collapsedNotHovered
        ? {
            paddingInlineEnd: theme.spacing(1.25)
          }
        : {
            paddingInlineEnd: theme.spacing(4)
          })
    },
    [`& .${verticalNavClasses.backdrop}`]: {
      backgroundColor: 'var(--backdrop-color)'
    }
  }
}

export default navigationCustomStyles
