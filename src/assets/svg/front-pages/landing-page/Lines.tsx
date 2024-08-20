// React Imports
import type { SVGAttributes } from 'react'

const Lines = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg width='27' height='24' viewBox='0 0 27 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <g clipPath='url(#clip0_425_86585)'>
        <path
          d='M3.92822 21.7239C3.92822 21.7239 5.63458 15.4372 7.30834 11.5858C8.9821 7.7345 12.5 2 12.5 2'
          stroke='var(--mui-palette-primary-main)'
          strokeWidth='4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M14.5 21.7239C14.5 21.7239 16.2063 15.4372 17.8801 11.5858C19.5538 7.7345 23.0718 2 23.0718 2'
          stroke='var(--mui-palette-success-main)'
          strokeWidth='4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_425_86585'>
          <rect width='25.1436' height='23.7239' fill='white' transform='translate(0.928223)' />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Lines
