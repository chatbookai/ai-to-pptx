// ** Type Imports
import { NavLink, NavGroup, LayoutProps, NavSectionTitle } from 'src/@core/layouts/types'

// ** Custom Menu Components
import VerticalNavLink from './VerticalNavLink'
import VerticalNavGroup from './VerticalNavGroup'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'

interface Props {
  parent?: NavGroup
  navHover?: boolean
  navVisible?: boolean
  groupActive: string[]
  isSubToSub?: NavGroup
  currentActiveGroup: string[]
  navigationBorderWidth: number
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  setGroupActive: (value: string[]) => void
  setCurrentActiveGroup: (item: string[]) => void
  verticalNavItems?: LayoutProps['verticalLayoutProps']['navMenu']['navItems']
}

const resolveNavItemComponent = (item: NavGroup | NavLink | NavSectionTitle) => {
  if ((item as NavSectionTitle).sectionTitle) return VerticalNavSectionTitle
  if ((item as NavGroup).children) return VerticalNavGroup

  return VerticalNavLink
}

const VerticalNavItems = (props: Props) => {
  // ** Props
  const { verticalNavItems } = props

  const RenderMenuItems = verticalNavItems && verticalNavItems.length > 0 && verticalNavItems.map((item: NavGroup | NavLink | NavSectionTitle, index: number) => {
    const TagName: any = resolveNavItemComponent(item)

    return <TagName {...props} key={index} item={item} />
  })

  return <>{RenderMenuItems}</>
}

export default VerticalNavItems
