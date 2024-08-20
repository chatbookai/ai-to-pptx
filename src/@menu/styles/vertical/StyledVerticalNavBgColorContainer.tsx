// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { VerticalNavProps } from '../../components/vertical-menu/VerticalNav'

type StyledVerticalNavBgColorContainerProps = Pick<VerticalNavProps, 'backgroundColor'>

const StyledVerticalNavBgColorContainer = styled.div<StyledVerticalNavBgColorContainerProps>`
  position: relative;
  block-size: 100%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  ${({ backgroundColor }) => backgroundColor && `background-color:${backgroundColor};`}
`

export default StyledVerticalNavBgColorContainer
