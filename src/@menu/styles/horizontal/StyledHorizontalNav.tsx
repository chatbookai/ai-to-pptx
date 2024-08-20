// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { HorizontalNavProps } from '../../components/horizontal-menu/HorizontalNav'

const StyledHorizontalNav = styled.div<Pick<HorizontalNavProps, 'customStyles'>>`
  inline-size: 100%;
  overflow: hidden;
  position: relative;
  ${({ customStyles }) => customStyles}
`

export default StyledHorizontalNav
