'use client'

// MUI imports
import { styled } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

// Styled Components
const AppFullCalendar = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  position: 'relative',
  borderRadius: 'var(--mui-shape-borderRadius)',
  '& .fc': {
    zIndex: 1,

    '.fc-col-header, .fc-daygrid-body, .fc-scrollgrid-sync-table, .fc-timegrid-body, .fc-timegrid-body table': {
      width: '100% !important'
    },

    // Toolbar
    '& .fc-toolbar': {
      flexWrap: 'wrap',
      flexDirection: 'row !important',
      '&.fc-header-toolbar': {
        gap: theme.spacing(2),
        marginBottom: theme.spacing(5)
      },
      '& .fc-sidebarToggle-button': {
        color: 'var(--mui-palette-text-secondary) !important',
        marginInlineEnd: theme.spacing(2)
      },
      '& .fc-button-group:has(.fc-next-button)': {
        marginInlineStart: theme.spacing(2)
      },
      '.fc-prev-button, & .fc-next-button': {
        display: 'flex',
        backgroundColor: 'transparent',
        padding: theme.spacing(1.5),
        border: '1px solid var(--mui-palette-secondary-main)',
        borderRadius: 'var(--mui-shape-borderRadius) !important',
        '& .fc-icon': {
          color: 'var(--mui-palette-text-secondary)',
          fontSize: '1.25rem'
        },
        '&:hover, &:active, &:focus': {
          boxShadow: 'none !important',
          backgroundColor: 'transparent !important'
        }
      },
      '& .fc-toolbar-chunk:first-of-type': {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        rowGap: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
          '& div:first-of-type': {
            display: 'flex',
            alignItems: 'center'
          }
        }
      },
      '& .fc-button': {
        '&:active, .&:focus': {
          boxShadow: 'none'
        }
      },
      '& .fc-button-group': {
        '& .fc-button': {
          textTransform: 'capitalize',
          '&:focus': {
            boxShadow: 'none'
          }
        },
        '& .fc-button-primary': {
          '&:not(.fc-prev-button):not(.fc-next-button)': {
            ...theme.typography.button,
            textTransform: 'capitalize',
            backgroundColor: 'transparent',
            padding: theme.spacing(1.75, 4),
            color: 'var(--mui-palette-primary-main)',
            borderColor: 'var(--mui-palette-primary-main)',
            '&.fc-button-active, &:hover': {
              color: 'var(--mui-palette-primary-main)',
              borderColor: 'var(--mui-palette-primary-main)',
              backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
            }
          }
        },
        '& .fc-sidebarToggle-button': {
          border: 0,
          lineHeight: 0.8,
          borderColor: 'transparent',
          paddingBottom: '0 !important',
          backgroundColor: 'transparent',
          marginLeft: `${theme.spacing(-2)} !important`,
          padding: `${theme.spacing(1.275, 2)} !important`,
          '&:focus': {
            outline: 0,
            boxShadow: 'none'
          },
          '&:not(.fc-prev-button):not(.fc-next-button):hover': {
            backgroundColor: 'transparent !important'
          },
          '& + div': {
            marginLeft: 0
          }
        },
        '.fc-dayGridMonth-button, .fc-timeGridWeek-button, .fc-timeGridDay-button, & .fc-listMonth-button': {
          padding: theme.spacing(2.2, 6),

          '&:last-of-type, &:first-of-type': {
            borderRadius: 'var(--mui-shape-borderRadius)'
          },
          '&:first-of-type': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          },
          '&:last-of-type': {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }
        }
      },
      '& > * > :not(:first-of-type)': {
        marginLeft: 0
      },
      '& .fc-toolbar-title': {
        marginInline: theme.spacing(4),
        ...theme.typography.h4
      },
      '.fc-button:empty:not(.fc-sidebarToggle-button), & .fc-toolbar-chunk:empty': {
        display: 'none'
      }
    },

    // Calendar head & body common
    '& tbody td, & thead th': {
      borderColor: 'var(--mui-palette-divider)',
      '&.fc-col-header-cell': {
        borderLeft: 0,
        borderRight: 0
      },
      '&[role="presentation"]': {
        borderRightWidth: 0
      }
    },
    '& colgroup col': {
      width: '60px !important'
    },

    // Event Colors
    '& .fc-event': {
      '& .fc-event-title-container, .fc-event-main-frame': {
        lineHeight: 1
      },
      '&:not(.fc-list-event)': {
        '&.event-bg-primary': {
          border: 0,
          color: 'var(--mui-palette-primary-main)',

          // backgroundColor: bgColors.primaryLight.backgroundColor,
          backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
          '& .fc-event-title, & .fc-event-time': {
            fontSize: theme.typography.caption.fontSize,
            fontWeight: 500,
            color: 'var(--mui-palette-primary-main)',
            padding: 0
          }
        },
        '&.event-bg-success': {
          border: 0,
          color: 'var(--mui-palette-success-main)',

          // backgroundColor: bgColors.successLight.backgroundColor,
          backgroundColor: 'var(--mui-palette-success-lightOpacity)',
          '& .fc-event-title, & .fc-event-time': {
            fontSize: theme.typography.caption.fontSize,
            fontWeight: 500,
            color: 'var(--mui-palette-success-main)',
            padding: 0
          }
        },
        '&.event-bg-error': {
          border: 0,
          color: 'var(--mui-palette-error-main)',

          // backgroundColor: bgColors.errorLight.backgroundColor,
          backgroundColor: 'var(--mui-palette-error-lightOpacity)',
          '& .fc-event-title, & .fc-event-time': {
            fontSize: theme.typography.caption.fontSize,
            fontWeight: 500,
            color: 'var(--mui-palette-error-main)',
            padding: 0
          }
        },
        '&.event-bg-warning': {
          border: 0,
          color: 'var(--mui-palette-warning-main)',

          // backgroundColor: bgColors.warningLight.backgroundColor,
          backgroundColor: 'var(--mui-palette-warning-lightOpacity)',
          '& .fc-event-title, & .fc-event-time': {
            fontSize: theme.typography.caption.fontSize,
            fontWeight: 500,
            color: 'var(--mui-palette-warning-main)',
            padding: 0
          }
        },
        '&.event-bg-info': {
          border: 0,
          color: 'var(--mui-palette-info-main)',

          // backgroundColor: bgColors.infoLight.backgroundColor,
          backgroundColor: 'var(--mui-palette-info-lightOpacity)',
          '& .fc-event-title, & .fc-event-time': {
            fontSize: theme.typography.caption.fontSize,
            fontWeight: 500,
            color: 'var(--mui-palette-info-main)',
            padding: 0
          }
        }
      },
      '&.event-bg-primary': {
        '& .fc-list-event-dot': {
          borderColor: 'var(--mui-palette-primary-main)',
          backgroundColor: 'var(--mui-palette-primary-main)'
        },
        '&:hover td': {
          backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
        }
      },
      '&.event-bg-success': {
        '& .fc-list-event-dot': {
          borderColor: 'var(--mui-palette-success-main)',
          backgroundColor: 'var(--mui-palette-success-main)'
        },
        '&:hover td': {
          backgroundColor: 'var(--mui-palette-success-lightOpacity)'
        }
      },
      '&.event-bg-error': {
        '& .fc-list-event-dot': {
          borderColor: 'var(--mui-palette-error-main)',
          backgroundColor: 'var(--mui-palette-error-main)'
        },
        '&:hover td': {
          backgroundColor: 'var(--mui-palette-error-lightOpacity)'
        }
      },
      '&.event-bg-warning': {
        '& .fc-list-event-dot': {
          borderColor: 'var(--mui-palette-warning-main)',
          backgroundColor: 'var(--mui-palette-warning-main)'
        },
        '&:hover td': {
          backgroundColor: 'var(--mui-palette-warning-lightOpacity)'
        }
      },
      '&.event-bg-info': {
        '& .fc-list-event-dot': {
          borderColor: 'var(--mui-palette-info-main)',
          backgroundColor: 'var(--mui-palette-info-main)'
        },
        '&:hover td': {
          backgroundColor: 'var(--mui-palette-info-lightOpacity)'
        }
      },
      '&.fc-daygrid-event': {
        margin: 0,
        borderRadius: '500px'
      }
    },

    '& .fc-view-harness': {
      minHeight: '650px',
      margin: theme.spacing(0, -5.25),
      width: `calc(100% + ${theme.spacing(5.25 * 2)})`
    },

    // Calendar Head
    '& .fc-col-header': {
      '& .fc-col-header-cell': {
        fontSize: '.875rem',
        color: 'var(--mui-palette-text-primary)',
        '& .fc-col-header-cell-cushion': {
          ...theme.typography.body1,
          fontWeight: 500,
          padding: theme.spacing(2),
          textDecoration: 'none !important'
        }
      }
    },

    // Daygrid
    '& .fc-scrollgrid-section-liquid > td': {
      borderBottom: 0
    },
    '& .fc-daygrid-event-harness': {
      '& .fc-event': {
        padding: theme.spacing(1, 2)
      },
      '&:not(:last-of-type) .fc-event': {
        marginBottom: `${theme.spacing(2.5)} !important`
      }
    },
    '& .fc-daygrid-day-bottom': {
      marginTop: theme.spacing(2.5)
    },
    '& .fc-daygrid-day': {
      padding: '8px',
      '& .fc-daygrid-day-top': {
        flexDirection: 'row'
      }
    },
    '& .fc-scrollgrid': {
      borderColor: 'var(--mui-palette-divider)',
      borderInlineStart: 0
    },
    '& .fc-daygrid-day-events': {
      marginTop: theme.spacing(2.5),
      minHeight: '5rem !important'
    },
    '& .fc-day-other .fc-daygrid-day-top': {
      opacity: 1,
      '& .fc-daygrid-day-number': {
        color: 'var(--mui-palette-text-disabled) !important'
      }
    },

    // All Views Event
    '& .fc-daygrid-day-number, & .fc-timegrid-slot-label-cushion, & .fc-list-event-time': {
      textDecoration: 'none !important'
    },
    '& .fc-daygrid-day-number': {
      color: 'var(--mui-palette-text-secondary) !important',
      padding: 0
    },
    '& .fc-timegrid-slot-label-cushion, & .fc-list-event-time': {
      color: 'var(--mui-palette-text-primary) !important'
    },
    '& .fc-day-today:not(.fc-popover)': {
      backgroundColor: 'var(--mui-palette-action-hover)'
    },

    // WeekView
    '& .fc-timegrid': {
      '& .fc-scrollgrid-section': {
        '& .fc-col-header-cell, & .fc-timegrid-axis': {
          borderLeft: 0,
          borderRight: 0,
          background: 'transparent',
          borderColor: 'var(--mui-palette-divider)'
        },
        '& .fc-timegrid-axis': {
          borderColor: 'var(--mui-palette-divider)'
        },
        '& .fc-timegrid-axis-frame': {
          justifyContent: 'center',
          padding: theme.spacing(2),
          alignItems: 'flex-start'
        },
        '&:has(.fc-timegrid-divider)': {
          height: 0
        }
      },
      '& .fc-timegrid-axis': {
        '&.fc-scrollgrid-shrink': {
          '& .fc-timegrid-axis-cushion': {
            ...theme.typography.body2,
            padding: 0,
            textTransform: 'capitalize',
            color: 'var(--mui-palette-text-disabled)'
          }
        }
      },
      '& .fc-timegrid-slots': {
        '& .fc-timegrid-slot': {
          height: '3rem',
          borderColor: 'var(--mui-palette-divider)',
          '&.fc-timegrid-slot-label': {
            borderRight: 0,
            padding: theme.spacing(2),
            verticalAlign: 'top'
          },
          '&.fc-timegrid-slot-lane': {
            borderLeft: 0
          },
          '& .fc-timegrid-slot-label-frame': {
            textAlign: 'center',
            '& .fc-timegrid-slot-label-cushion': {
              display: 'block',
              padding: 0,
              ...theme.typography.body2,
              textTransform: 'uppercase'
            }
          }
        }
      },
      '& .fc-timegrid-divider': {
        display: 'none'
      },
      '& .fc-timegrid-event': {
        '& .fc-event-time': {
          ...theme.typography.caption,
          marginBlockEnd: 2
        },
        '& .fc-event-title': {
          lineHeight: 1.5385
        },
        boxShadow: 'none'
      },
      '.fc-timegrid-col-events': {
        margin: 0,
        '& .fc-event-main': {
          padding: theme.spacing(2)
        }
      }
    },
    '& .fc-timeGridWeek-view .fc-timegrid-slot-minor': {
      borderBlockStart: 0
    },

    // List View
    '& .fc-list': {
      border: 'none',
      '& th[colspan="3"]': {
        position: 'relative'
      },
      '& .fc-list-day-cushion': {
        background: 'transparent',
        padding: theme.spacing(2, 4)
      },
      '.fc-list-event': {
        cursor: 'pointer',
        '&:hover': {
          '& td': {
            // backgroundColor: `rgba(${theme.palette.customColors.main}, 0.04)`
          }
        },
        '& td': {
          borderColor: 'var(--mui-palette-divider)'
        }
      },
      '& .fc-list-event-graphic': {
        padding: theme.spacing(2)
      },
      '& .fc-list-day': {
        backgroundColor: 'var(--mui-palette-action-hover)',

        '& .fc-list-day-text, & .fc-list-day-side-text': {
          ...theme.typography.body1,
          fontWeight: 500,
          textDecoration: 'none'
        },

        '&  >  *': {
          background: 'none',
          borderColor: 'var(--mui-palette-divider)'
        }
      },
      '& .fc-list-event-title': {
        ...theme.typography.body1,
        color: 'var(--mui-palette-text-secondary) !important',
        padding: theme.spacing(2, 4, 2, 2)
      },
      '& .fc-list-event-time': {
        ...theme.typography.body1,
        color: 'var(--mui-palette-text-secondary) !important',
        padding: theme.spacing(2, 4)
      },
      '.fc-list-table tbody > tr:first-child th': {
        borderTop: '1px solid var(--mui-palette-divider)'
      },
      '.fc-list-table': {
        borderBottom: '1px solid var(--mui-palette-divider)'
      }
    },

    // Popover
    '& .fc-popover': {
      zIndex: 20,
      '[data-skin="bordered"] &': {
        boxShadow: 'none'
      },
      boxShadow: 1,
      borderColor: 'var(--mui-palette-divider)',
      borderRadius: 'var(--mui-shape-borderRadius)',
      background: 'var(--mui-palette-background-paper)',
      '& .fc-popover-header': {
        padding: theme.spacing(2),
        borderStartStartRadius: 'var(--mui-shape-borderRadius)',
        borderStartEndRadius: 'var(--mui-shape-borderRadius)',
        background: 'var(--mui-palette-action-hover)',
        '& .fc-popover-title, & .fc-popover-close': {
          color: 'var(--mui-palette-text-primary)'
        }
      }
    },

    // Media Queries
    [theme.breakpoints.up('md')]: {
      '& .fc-sidebarToggle-button': {
        display: 'none'
      },
      '& .fc-toolbar-title': {
        marginLeft: 0
      }
    }
  }
}))

export default AppFullCalendar
