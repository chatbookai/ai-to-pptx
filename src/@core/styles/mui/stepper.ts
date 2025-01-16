// ** MUI imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Hooks Imports
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'

const StepperWrapper = styled(Box)<BoxProps>(({ theme }) => {
  // ** Hook
  const bgColors: UseBgColorType = useBgColor()

  return {
    [theme.breakpoints.down('md')]: {
      '& .MuiStepper-horizontal:not(.MuiStepper-alternativeLabel)': {
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    },
    '& .MuiStep-root': {
      '& .step-label': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      '& .step-number': {
        fontWeight: 'bold',
        fontSize: '2.125rem',
        marginRight: theme.spacing(2.5),
        color: theme.palette.text.primary
      },
      '& .step-title': {
        fontWeight: 600,
        fontSize: '0.875rem',
        color: theme.palette.text.primary
      },
      '& .step-subtitle': {
        fontSize: '0.75rem',
        color: theme.palette.text.secondary
      },
      '& .MuiStepLabel-root.Mui-disabled': {
        '& .step-number': {
          color: theme.palette.text.disabled
        }
      },
      '& .Mui-error': {
        '& .MuiStepLabel-labelContainer, & .step-number, & .step-title, & .step-subtitle': {
          color: theme.palette.error.main
        }
      }
    },
    '& .MuiStepConnector-root': {
      '& .MuiStepConnector-line': {
        borderWidth: 3,
        borderRadius: 3
      },
      '&.Mui-active, &.Mui-completed': {
        '& .MuiStepConnector-line': {
          borderColor: theme.palette.primary.main
        }
      },
      '&.Mui-disabled .MuiStepConnector-line': {
        borderColor: bgColors.primaryLight.backgroundColor
      }
    },
    '& .MuiStepper-alternativeLabel': {
      '& .MuiStepConnector-root': {
        top: 10
      },
      '& .MuiStepLabel-labelContainer': {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        '& > * + *': {
          marginTop: theme.spacing(1)
        }
      }
    },
    '& .MuiStepper-vertical': {
      '& .MuiStep-root': {
        '& .step-label': {
          justifyContent: 'flex-start'
        },
        '& .MuiStepContent-root': {
          borderWidth: 3,
          marginLeft: theme.spacing(2.25),
          borderColor: theme.palette.primary.main
        },
        '& .button-wrapper': {
          marginTop: theme.spacing(4)
        },
        '&.active + .MuiStepConnector-root .MuiStepConnector-line': {
          borderColor: theme.palette.primary.main
        }
      },
      '& .MuiStepConnector-root': {
        marginLeft: theme.spacing(2.25),
        '& .MuiStepConnector-line': {
          borderRadius: 0
        }
      }
    }
  }
})

export default StepperWrapper
