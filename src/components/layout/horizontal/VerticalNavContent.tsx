// Next Imports
import Link from 'next/link'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import NavHeader from '@menu/components/vertical-menu/NavHeader'
import Logo from '@components/layout/shared/Logo'
import NavCollapseIcons from '@menu/components/vertical-menu/NavCollapseIcons'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { mapHorizontalToVerticalMenu } from '@menu/utils/menuUtils'

const VerticalNavContent = ({ children }: ChildrenType) => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  // Vars
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <>
      <NavHeader>
        <Link href='/'>
          <Logo />
        </Link>
        <NavCollapseIcons
          lockedIcon={<i className='ri-radio-button-line text-xl' />}
          unlockedIcon={<i className='ri-checkbox-blank-circle-line text-xl' />}
          closeIcon={<i className='ri-close-line text-xl' />}
          className='text-textSecondary'
        />
      </NavHeader>
      <ScrollWrapper
        {...(isBreakpointReached
          ? { className: 'bs-full overflow-y-auto overflow-x-hidden' }
          : { options: { wheelPropagation: false, suppressScrollX: true } })}
      >
        {mapHorizontalToVerticalMenu(children)}
      </ScrollWrapper>
    </>
  )
}

export default VerticalNavContent
