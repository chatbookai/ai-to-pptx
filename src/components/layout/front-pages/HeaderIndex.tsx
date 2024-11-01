// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Header from '@components/layout/front-pages/Header'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

const HeaderIndex = ({ children }: ChildrenType) => {
  // Vars
  const mode = 'light'

  return (
    <div className={frontLayoutClasses.root}>
      <Header mode={mode} />
      {children}
    </div>
  )
}

export default HeaderIndex
