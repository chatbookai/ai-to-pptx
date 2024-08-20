// React Imports
import type { SVGAttributes } from 'react'

const LifeBuoy = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='42' height='43' viewBox='0 0 42 43' fill='none' {...props}>
      <path
        d='M21 39.2239C30.6652 39.2239 38.5 31.3891 38.5 21.7239C38.5 12.0586 30.6652 4.22388 21 4.22388C11.3348 4.22388 3.5 12.0586 3.5 21.7239C3.5 31.3891 11.3348 39.2239 21 39.2239Z'
        stroke='var(--mui-palette-primary-main)'
        strokeWidth='3.225'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M16.1612 26.7814L8.75 33.9739M25.8387 26.7814L33.25 33.9739M25.8387 16.6664L33.25 9.47388M16.1612 16.6664L8.75 9.47388M14 21.7239C14 23.5804 14.7375 25.3609 16.0503 26.6736C17.363 27.9864 19.1435 28.7239 21 28.7239C22.8565 28.7239 24.637 27.9864 25.9497 26.6736C27.2625 25.3609 28 23.5804 28 21.7239C28 19.8674 27.2625 18.0869 25.9497 16.7741C24.637 15.4614 22.8565 14.7239 21 14.7239C19.1435 14.7239 17.363 15.4614 16.0503 16.7741C14.7375 18.0869 14 19.8674 14 21.7239Z'
        stroke='var(--mui-palette-primary-main)'
        strokeWidth='3.225'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default LifeBuoy
