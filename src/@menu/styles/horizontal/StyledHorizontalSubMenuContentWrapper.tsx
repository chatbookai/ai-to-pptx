// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { RootStylesType } from '../../types'

const StyledHorizontalSubMenuContentWrapper = styled.div<RootStylesType>`
  z-index: 10;

  ${({ rootStyles }) => rootStyles};
`

export default StyledHorizontalSubMenuContentWrapper
