// React Imports
import type { SVGAttributes } from 'react'

function Curve(props: SVGAttributes<SVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='72' height='12' viewBox='0 0 72 12' fill='none' {...props}>
      <path
        d='M2 2.89554C13.6853 8.1779 43.6447 15.5732 70 2.89554'
        stroke='var(--mui-palette-primary-main)'
        strokeWidth='4'
        strokeLinecap='round'
      />
    </svg>
  )
}

export default Curve
