// ** MUI imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings' // ** Hooks Imports
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styles
import 'react-datepicker/dist/react-datepicker.css'

const DatePickerWrapper = styled(Box)<BoxProps>(({ theme }) => {
  // ** Hook
  const { settings } = useSettings()
  const bgColors: UseBgColorType = useBgColor()

  return {
    '& .react-datepicker-popper': {
      zIndex: 20
    },
    '& .react-datepicker-wrapper': {
      width: '100%'
    },
    '& .react-datepicker': {
      color: theme.palette.text.primary,
      borderRadius: theme.shape.borderRadius,
      fontFamily: theme.typography.fontFamily,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[settings.skin === 'bordered' ? 0 : 7],
      border: settings.skin === 'bordered' ? `1px solid ${theme.palette.divider}` : 'none',
      '& .react-datepicker__header': {
        padding: 0,
        border: 'none',
        fontWeight: 'normal',
        backgroundColor: theme.palette.background.paper,
        '&:not(.react-datepicker-year-header)': {
          '& + .react-datepicker__month, & + .react-datepicker__year': {
            margin: theme.spacing(3.2),
            marginTop: theme.spacing(6)
          }
        },
        '&.react-datepicker-year-header': {
          '& + .react-datepicker__month, & + .react-datepicker__year': {
            margin: theme.spacing(3.2),
            marginTop: theme.spacing(4)
          }
        }
      },
      '& .react-datepicker__triangle': {
        display: 'none'
      },
      '& > .react-datepicker__navigation': {
        top: 18,
        '&.react-datepicker__navigation--previous': {
          width: 24,
          height: 24,
          border: 'none',
          ...(theme.direction === 'ltr' ? { left: 15 } : { right: 15 }),
          backgroundImage: `${"url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' style=\\'width:24px;height:24px\\' viewBox=\\'0 0 24 24\\'%3E%3Cpath fill=\\'currentColor\\' d=\\'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z\\' /%3E%3C/svg%3E')"
            .replace('currentColor', theme.palette.text.secondary)
            .replace('#', '%23')}`,
          '& .react-datepicker__navigation-icon': {
            display: 'none'
          }
        },
        '&.react-datepicker__navigation--next': {
          width: 24,
          height: 24,
          border: 'none',
          ...(theme.direction === 'ltr' ? { right: 15 } : { left: 15 }),
          backgroundImage: `${"url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' style=\\'width:24px;height:24px\\' viewBox=\\'0 0 24 24\\'%3E%3Cpath fill=\\'currentColor\\' d=\\'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z\\' /%3E%3C/svg%3E')"
            .replace('currentColor', theme.palette.text.secondary)
            .replace('#', '%23')}`,
          '& .react-datepicker__navigation-icon': {
            display: 'none'
          }
        },
        '&.react-datepicker__navigation--next--with-time': theme.direction === 'ltr' ? { right: 127 } : { left: 127 },
        '&:focus, &:active': {
          outline: 0
        }
      },
      '& .react-datepicker__month-container': {
        paddingTop: theme.spacing(3.2)
      },
      '& .react-datepicker__current-month, & .react-datepicker-year-header': {
        lineHeight: 2.1,
        fontSize: '1rem',
        fontWeight: 'normal',
        letterSpacing: '0.15px',
        marginBottom: theme.spacing(2),
        color: theme.palette.text.primary
      },
      '& .react-datepicker__day-name': {
        margin: 0,
        lineHeight: 1.5,
        width: '2.25rem',
        fontSize: '0.75rem',
        letterSpacing: '0.4px',
        color: theme.palette.text.secondary
      },
      '& .react-datepicker__day': {
        margin: 0,
        width: '2.25rem',
        borderRadius: '50%',
        lineHeight: '2.25rem',
        color: theme.palette.text.primary,
        '&.react-datepicker__day--selected.react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-start, &.react-datepicker__day--selected.react-datepicker__day--range-start.react-datepicker__day--in-range, &.react-datepicker__day--range-start':
          {
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%',
            color: `${theme.palette.common.white} !important`,
            backgroundColor: `${theme.palette.primary.main} !important`
          },
        '&.react-datepicker__day--range-end.react-datepicker__day--in-range': {
          borderTopRightRadius: '50%',
          borderBottomRightRadius: '50%',
          color: `${theme.palette.common.white} !important`,
          backgroundColor: `${theme.palette.primary.main} !important`
        },
        '&:focus, &:active': {
          outline: 0
        },
        '&.react-datepicker__day--outside-month, &.react-datepicker__day--disabled:not(.react-datepicker__day--selected)':
          {
            color: theme.palette.text.disabled,
            '&:hover': {
              backgroundColor: 'transparent'
            }
          },
        '&.react-datepicker__day--highlighted, &.react-datepicker__day--highlighted:hover': {
          color: theme.palette.success.main,
          backgroundColor: `${bgColors.successLight.backgroundColor} !important`,
          '&.react-datepicker__day--selected': {
            backgroundColor: `${theme.palette.primary.main} !important`
          }
        }
      },
      '& .react-datepicker__day--in-range, & .react-datepicker__day--in-selecting-range': {
        borderRadius: 0,
        color: theme.palette.primary.main,
        backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.06)} !important`
      },
      '& .react-datepicker__day--today': {
        fontWeight: 'normal',
        '&:not(.react-datepicker__day--selected):not(:empty)': {
          lineHeight: '2.125rem',
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          '&:hover': {
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.04)
          },
          '&.react-datepicker__day--keyboard-selected': {
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.06),
            '&:hover': {
              backgroundColor: hexToRGBA(theme.palette.primary.main, 0.06)
            }
          }
        }
      },
      '& .react-datepicker__month-text--today': {
        fontWeight: 'normal',
        '&:not(.react-datepicker__month--selected)': {
          lineHeight: '2.125rem',
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          '&:hover': {
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.04)
          }
        }
      },
      '& .react-datepicker__year-text--today': {
        fontWeight: 'normal',
        '&:not(.react-datepicker__year-text--selected)': {
          lineHeight: '2.125rem',
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          '&:hover': {
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.04)
          },
          '&.react-datepicker__year-text--keyboard-selected': {
            color: theme.palette.primary.main,
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.06),
            '&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: hexToRGBA(theme.palette.primary.main, 0.06)
            }
          }
        }
      },
      '& .react-datepicker__day--keyboard-selected': {
        '&:not(.react-datepicker__day--in-range)': {
          backgroundColor: `rgba(${theme.palette.customColors.main}, 0.06)`,
          '&:hover': {
            backgroundColor: `rgba(${theme.palette.customColors.main}, 0.06)`
          }
        },
        '&.react-datepicker__day--in-range:not(.react-datepicker__day--range-end)': {
          backgroundColor: `${bgColors.primaryLight.backgroundColor} !important`,
          '&:hover': {
            backgroundColor: `${bgColors.primaryLight.backgroundColor} !important`
          }
        }
      },
      '& .react-datepicker__month-text--keyboard-selected': {
        '&:not(.react-datepicker__month--in-range)': {
          color: theme.palette.text.primary,
          backgroundColor: `rgba(${theme.palette.customColors.main}, 0.06)`,
          '&:hover': {
            color: theme.palette.text.primary,
            backgroundColor: `rgba(${theme.palette.customColors.main}, 0.06)`
          }
        }
      },
      '& .react-datepicker__year-text--keyboard-selected': {
        color: theme.palette.text.primary,
        backgroundColor: `rgba(${theme.palette.customColors.main}, 0.06)`,
        '&:hover': {
          color: theme.palette.text.primary,
          backgroundColor: `rgba(${theme.palette.customColors.main}, 0.06)`
        }
      },
      '& .react-datepicker__day--selected, & .react-datepicker__month--selected, & .react-datepicker__year-text--selected, & .react-datepicker__quarter--selected':
        {
          color: `${theme.palette.common.white} !important`,
          backgroundColor: `${theme.palette.primary.main} !important`,
          '&:hover': {
            backgroundColor: `${theme.palette.primary.dark} !important`
          }
        },
      '& .react-datepicker__header__dropdown': {
        '& .react-datepicker__month-dropdown-container:not(:last-child)': {
          marginRight: theme.spacing(8)
        },
        '& .react-datepicker__month-dropdown-container, & .react-datepicker__year-dropdown-container': {
          marginBottom: theme.spacing(4)
        },
        '& .react-datepicker__month-read-view--selected-month, & .react-datepicker__year-read-view--selected-year': {
          fontSize: '0.875rem',
          marginRight: theme.spacing(1),
          color: theme.palette.text.primary
        },
        '& .react-datepicker__month-read-view:hover .react-datepicker__month-read-view--down-arrow, & .react-datepicker__year-read-view:hover .react-datepicker__year-read-view--down-arrow':
          {
            borderColor: theme.palette.text.secondary
          },
        '& .react-datepicker__month-read-view--down-arrow, & .react-datepicker__year-read-view--down-arrow': {
          top: 4,
          borderColor: theme.palette.text.disabled
        },
        '& .react-datepicker__month-dropdown, & .react-datepicker__year-dropdown': {
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          borderColor: theme.palette.divider,
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.palette.mode === 'light' ? theme.shadows[8] : theme.shadows[9]
        },
        '& .react-datepicker__month-option, & .react-datepicker__year-option': {
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          '&:first-of-type, &:last-of-type': {
            borderRadius: 0
          },
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        },
        '& .react-datepicker__month-option.react-datepicker__month-option--selected_month': {
          backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08),
          '&:hover': {
            backgroundColor: bgColors.primaryLight.backgroundColor
          },
          '& .react-datepicker__month-option--selected': {
            display: 'none'
          }
        },
        '& .react-datepicker__year-option.react-datepicker__year-option--selected_year': {
          backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08),
          '&:hover': {
            backgroundColor: bgColors.primaryLight.backgroundColor
          },
          '& .react-datepicker__year-option--selected': {
            display: 'none'
          }
        },
        '& .react-datepicker__year-option': {
          // TODO: Remove some of the following styles for arrow in Year dropdown when react-datepicker give arrows in Year dropdown
          '& .react-datepicker__navigation--years-upcoming': {
            width: 9,
            height: 9,
            borderStyle: 'solid',
            borderWidth: '3px 3px 0 0',
            transform: 'rotate(-45deg)',
            borderTopColor: theme.palette.text.disabled,
            borderRightColor: theme.palette.text.disabled,
            margin: `${theme.spacing(2.75)} auto ${theme.spacing(0)}`
          },
          '&:hover .react-datepicker__navigation--years-upcoming': {
            borderTopColor: theme.palette.text.secondary,
            borderRightColor: theme.palette.text.secondary
          },
          '& .react-datepicker__navigation--years-previous': {
            width: 9,
            height: 9,
            borderStyle: 'solid',
            borderWidth: '0 0 3px 3px',
            transform: 'rotate(-45deg)',
            borderLeftColor: theme.palette.text.disabled,
            borderBottomColor: theme.palette.text.disabled,
            margin: `${theme.spacing(0)} auto ${theme.spacing(2.75)}`
          },
          '&:hover .react-datepicker__navigation--years-previous': {
            borderLeftColor: theme.palette.text.secondary,
            borderBottomColor: theme.palette.text.secondary
          }
        }
      },
      '& .react-datepicker__week-number': {
        margin: 0,
        fontWeight: 600,
        width: '2.25rem',
        lineHeight: '2.25rem',
        color: theme.palette.text.primary
      },
      '& .react-datepicker__month-text, & .react-datepicker__year-text, & .react-datepicker__quarter-text': {
        margin: 0,
        alignItems: 'center',
        lineHeight: '2.25rem',
        display: 'inline-flex',
        justifyContent: 'center',
        borderRadius: theme.shape.borderRadius,
        '&:focus, &:active': {
          outline: 0
        }
      },
      '& .react-datepicker__year--container': {
        paddingTop: theme.spacing(3.2)
      },
      '& .react-datepicker__year-wrapper': {
        maxWidth: 205,
        justifyContent: 'center'
      },
      '& .react-datepicker__input-time-container': {
        display: 'flex',
        alignItems: 'center',
        ...(theme.direction === 'rtl' ? { flexDirection: 'row-reverse' } : {})
      },
      '& .react-datepicker__today-button': {
        borderTop: 0,
        borderRadius: '1rem',
        margin: theme.spacing(0, 4, 4),
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main
      },

      // ** Time Picker
      '&:not(.react-datepicker--time-only)': {
        '& .react-datepicker__time-container': {
          borderLeftColor: theme.palette.divider,
          [theme.breakpoints.down('sm')]: {
            width: '5.5rem'
          },
          [theme.breakpoints.up('sm')]: {
            width: '7rem'
          }
        },
        '.react-datepicker-time__header': {
          paddingTop: theme.spacing(3.2)
        }
      },
      '&.react-datepicker--time-only': {
        width: '7rem',
        padding: theme.spacing(1.2, 0),
        '& .react-datepicker__time-container': {
          width: 'calc(7rem - 2px)'
        }
      },
      '& .react-datepicker__time-container': {
        padding: theme.spacing(1.2, 0),
        '& .react-datepicker-time__header': {
          fontSize: '1rem',
          lineHeight: 1.31,
          fontWeight: 'normal',
          letterSpacing: '0.15px',
          marginBottom: theme.spacing(3),
          color: theme.palette.text.primary
        },

        '& .react-datepicker__time': {
          background: theme.palette.background.paper,
          '& .react-datepicker__time-box .react-datepicker__time-list-item--disabled': {
            pointerEvents: 'none',
            color: theme.palette.text.disabled,
            '&.react-datepicker__time-list-item--selected': {
              fontWeight: 'normal',
              backgroundColor: theme.palette.action.disabledBackground
            }
          }
        },

        '& .react-datepicker__time-list-item': {
          lineHeight: 1.75,
          height: 'auto !important',
          marginLeft: theme.spacing(3.2),
          marginRight: theme.spacing(1.2),
          color: theme.palette.text.primary,
          borderRadius: theme.shape.borderRadius,
          '&:focus, &:active': {
            outline: 0
          },
          '&:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`
          },
          '&.react-datepicker__time-list-item--selected:not(.react-datepicker__time-list-item--disabled)': {
            fontWeight: '600 !important',
            color: `${theme.palette.common.white} !important`,
            backgroundColor: `${theme.palette.primary.main} !important`
          }
        },

        '& .react-datepicker__time-box': {
          width: '100%'
        },
        '& .react-datepicker__time-list': {
          '&::-webkit-scrollbar': {
            width: 8
          },

          /* Track */
          '&::-webkit-scrollbar-track': {
            background: theme.palette.background.paper
          },

          /* Handle */
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 10,
            background: '#aaa'
          },

          /* Handle on hover */
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#999'
          }
        }
      },
      '& .react-datepicker__day:hover, & .react-datepicker__month-text:hover, & .react-datepicker__quarter-text:hover, & .react-datepicker__year-text:hover':
        {
          backgroundColor: theme.palette.action.hover
        }
    },
    '& .react-datepicker__close-icon': {
      paddingRight: theme.spacing(4),
      ...(theme.direction === 'rtl' ? { right: 0, left: 'auto' } : {}),
      '&:after': {
        width: 'unset',
        height: 'unset',
        fontSize: '1.5rem',
        color: theme.palette.text.primary,
        backgroundColor: 'transparent !important'
      }
    }
  }
})

export default DatePickerWrapper
