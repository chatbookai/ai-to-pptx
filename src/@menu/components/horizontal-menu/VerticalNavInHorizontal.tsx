// Type Imports
import type { BreakpointType, ChildrenType } from '../../types'
import type { VerticalNavProps } from '../vertical-menu/VerticalNav'

// Component Imports
import VerticalNav from '../../vertical-menu'

// Type
type VerticalNavInHorizontalProps = ChildrenType & {
  className?: string
  breakpoint?: BreakpointType
  customBreakpoint?: string
  verticalNavProps?: Pick<VerticalNavProps, 'width' | 'backgroundColor' | 'backgroundImage' | 'customStyles'>
}

const VerticalNavInHorizontal = (props: VerticalNavInHorizontalProps) => {
  // Props
  const { children, className, breakpoint, customBreakpoint, verticalNavProps } = props

  return (
    <VerticalNav
      {...verticalNavProps}
      className={className}
      breakpoint={breakpoint}
      customBreakpoint={customBreakpoint}
    >
      {children}
    </VerticalNav>
  )
}

export default VerticalNavInHorizontal
