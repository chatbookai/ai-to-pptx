// React Imports
import type { SVGAttributes } from 'react'

const Document = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='42' height='43' viewBox='0 0 42 43' fill='none' {...props}>
      <path
        d='M12.25 12.9739H29.75M12.25 21.7239H29.75M12.25 30.4739H22.75M33.25 5.97388H8.75C7.82174 5.97388 6.9315 6.34263 6.27513 6.999C5.61875 7.65538 5.25 8.54562 5.25 9.47388V33.9739C5.25 34.9021 5.61875 35.7924 6.27513 36.4488C6.9315 37.1051 7.82174 37.4739 8.75 37.4739H33.25C34.1783 37.4739 35.0685 37.1051 35.7249 36.4488C36.3813 35.7924 36.75 34.9021 36.75 33.9739V9.47388C36.75 8.54562 36.3813 7.65538 35.7249 6.999C35.0685 6.34263 34.1783 5.97388 33.25 5.97388Z'
        stroke='var(--mui-palette-primary-main)'
        strokeWidth='3.225'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default Document
