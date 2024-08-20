// React Imports
import type { SVGAttributes } from 'react'

const Edit = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='42' height='43' viewBox='0 0 42 43' fill='none' {...props}>
      <path
        d='M5.25 37.4739H36.75M21.3885 10.9229L26.3375 5.97388L35 14.6364L30.051 19.5854M21.3885 10.9229L11.5762 20.7351C11.248 21.0632 11.0636 21.5083 11.0635 21.9724V29.9104H19.0015C19.4656 29.9103 19.9106 29.7258 20.2387 29.3976L30.051 19.5854M21.3885 10.9229L30.051 19.5854'
        stroke='var(--mui-palette-primary-main)'
        strokeWidth='3.225'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default Edit
