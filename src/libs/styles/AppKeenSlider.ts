'use client'

// MUI imports
import { styled } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import 'keen-slider/keen-slider.min.css'

// Styled Components
const AppKeenSlider = styled('div')(({ theme }: { theme: Theme }) => ({
  '& .keen-slider': {
    // Keen Slider handles RTL internally and thus, we need to set the direction to LTR
    direction: 'ltr',

    '& .keen-slider__slide': {
      '& img': {
        height: 'auto',
        maxWidth: '100%'
      }
    },
    '&.thumbnail .keen-slider__slide:not(.active)': {
      opacity: 0.4
    },
    '&.zoom-out': {
      perspective: '1000px',

      '& .zoom-out__slide': {
        '& .slider-content-wrapper': {
          width: '100%',
          height: '100%',
          position: 'absolute',
          '& img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            backgroundColor: 'transparent'
          }
        }
      }
    },
    '& .default-slide': {
      height: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--mui-palette-background-default)'
    }
  },

  // Fade
  '& .fader': {
    position: 'relative',
    overflow: 'hidden',

    '& .fader__slide': {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0',
      '& img': {
        width: ' 100%',
        height: ' 100%',
        objectFit: 'cover',
        position: 'absolute'
      }
    }
  },

  // Navigation Controls
  '& .navigation-wrapper': {
    position: 'relative',
    '& .arrow': {
      top: '50%',
      width: '3rem',
      height: '3rem',
      cursor: 'pointer',
      position: 'absolute',
      transform: 'translateY(-50%)',
      color: 'var(--mui-palette-common-white)',
      ...(theme.direction === 'rtl' ? { transform: 'translateY(-50%) rotate(180deg)' } : {}),
      '&.arrow-disabled': {
        cursor: 'not-allowed',
        pointerEvents: 'none',
        color: 'var(--mui-palette-action-disabled)'
      },
      '&.arrow-left': {
        left: 0
      },
      '&.arrow-right': {
        right: 0
      }
    }
  },

  // Dots
  '& .swiper-dots': {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),

    '& .MuiBadge-root': {
      '&:not(:last-child)': {
        marginRight: theme.spacing(4)
      },
      '& .MuiBadge-dot': {
        width: 10,
        height: 10,
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: 'var(--mui-palette-action-disabled)'
      },
      '&.active .MuiBadge-dot': {
        backgroundColor: 'var(--mui-palette-primary-main)'
      }
    }
  }
}))

export default AppKeenSlider
