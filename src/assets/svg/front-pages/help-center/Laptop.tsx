// React Imports
import type { SVGAttributes } from 'react'

const Laptop = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='58' height='58' viewBox='0 0 58 58' fill='none' {...props}>
      <path
        opacity='0.2'
        d='M9.0625 39.875V16.3125C9.0625 15.3511 9.44442 14.4291 10.1242 13.7492C10.8041 13.0694 11.7261 12.6875 12.6875 12.6875H45.3125C46.2739 12.6875 47.1959 13.0694 47.8758 13.7492C48.5556 14.4291 48.9375 15.3511 48.9375 16.3125V39.875H9.0625Z'
        fill='var(--mui-palette-text-secondary)'
      />
      <path
        d='M9.0625 39.875V16.3125C9.0625 15.3511 9.44442 14.4291 10.1242 13.7492C10.8041 13.0694 11.7261 12.6875 12.6875 12.6875H45.3125C46.2739 12.6875 47.1959 13.0694 47.8758 13.7492C48.5556 14.4291 48.9375 15.3511 48.9375 16.3125V39.875M32.625 19.9375H25.375M5.4375 39.875H52.5625V43.5C52.5625 44.4614 52.1806 45.3834 51.5008 46.0633C50.8209 46.7431 49.8989 47.125 48.9375 47.125H9.0625C8.10109 47.125 7.17906 46.7431 6.49924 46.0633C5.81942 45.3834 5.4375 44.4614 5.4375 43.5V39.875Z'
        stroke='var(--mui-palette-text-secondary)'
        strokeOpacity='0.7'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default Laptop
