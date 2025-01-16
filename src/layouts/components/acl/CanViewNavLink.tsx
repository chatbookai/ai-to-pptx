// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { NavLink } from 'src/@core/layouts/types'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  return ability && ability.can(navLink && navLink.action, navLink && navLink.subject) ? <>{children}</> : null

}

export default CanViewNavLink
