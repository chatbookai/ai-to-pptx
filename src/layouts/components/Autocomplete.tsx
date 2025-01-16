// ** React Imports
import { useEffect, useCallback, useRef, useState, ChangeEvent, SyntheticEvent } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import MuiDialog from '@mui/material/Dialog'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'
import MuiAutocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'

// ** Third Party Imports
import axios from 'axios'

// ** Types Imports
import { Settings } from 'src/@core/context/settingsContext'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs Imports
import themeConfig from 'src/configs/themeConfig'

// ** Config
import { authConfig } from 'src/configs/auth'

type AppBarSearchType = {
  id: number
  url: string
  icon: string
  title: string
  category: string
}

interface Props {
  hidden: boolean
  settings: Settings
}

interface DefaultSuggestionsProps {
  setOpenDialog: (val: boolean) => void
}

interface NoResultProps {
  value: string
  setOpenDialog: (val: boolean) => void
}

interface DefaultSuggestionsType {
  category: string
  suggestions: {
    link: string
    icon: string
    suggestion: string
  }[]
}

const defaultSuggestionsData: DefaultSuggestionsType[] = []

const categoryTitle: { [k: string]: string } = {}

// ** Styled Autocomplete component
const Autocomplete = styled(MuiAutocomplete)(({ theme }) => ({
  '& fieldset': {
    border: 0
  },
  '& + .MuiAutocomplete-popper': {
    '& .MuiAutocomplete-listbox': {
      paddingTop: 0,
      height: '100%',
      maxHeight: 'inherit',
      '& .MuiListSubheader-root': {
        top: 0,
        fontWeight: 400,
        lineHeight: '15px',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        color: theme.palette.text.disabled
      }
    },
    '& .MuiAutocomplete-paper': {
      border: 0,
      height: '100%',
      borderRadius: 0,
      boxShadow: 'none'
    },
    '& .MuiListItem-root.suggestion': {
      padding: 0,
      '& .MuiListItemSecondaryAction-root': {
        display: 'flex'
      },
      '&.Mui-focused.Mui-focusVisible, &:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '& .MuiListItemButton-root: hover': {
        backgroundColor: 'transparent'
      },
      '&:not(:hover)': {
        '& .MuiListItemSecondaryAction-root': {
          display: 'none'
        },
        '&.Mui-focused, &.Mui-focused.Mui-focusVisible:not(:hover)': {
          '& .MuiListItemSecondaryAction-root': {
            display: 'flex'
          }
        },
        [theme.breakpoints.down('sm')]: {
          '&.Mui-focused:not(.Mui-focusVisible) .MuiListItemSecondaryAction-root': {
            display: 'none'
          }
        }
      }
    },
    '& .MuiAutocomplete-noOptions': {
      display: 'grid',
      minHeight: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(10)
    }
  }
}))

// ** Styled Dialog component
const Dialog = styled(MuiDialog)({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)'
  },
  '& .MuiDialog-paper': {
    overflow: 'hidden',
    '&:not(.MuiDialog-paperFullScreen)': {
      height: '100%',
      maxHeight: 550
    }
  }
})

const NoResult = ({ value, setOpenDialog }: NoResultProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ mb: 2.5, color: 'text.primary' }}>
        <Icon icon='mdi:file-remove-outline' fontSize='5rem' />
      </Box>
      <Typography variant='h6' sx={{ mb: 11.5, wordWrap: 'break-word' }}>
        没有结果: {' '}
        <Typography variant='h6' component='span' sx={{ wordWrap: 'break-word' }}>
          {`"${value}"`}
        </Typography>
      </Typography>

      <Typography variant='body2' sx={{ mb: 2.5, color: 'text.disabled' }}>
        尝试搜索
      </Typography>
      <List sx={{ py: 0 }}>
        <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
          <Box
            component={Link}
            href='/dashboards/analytics'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover > *': { color: 'primary.main' }
            }}
          >
            <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
              <Icon icon='mdi:cart-outline' fontSize={20} />
            </Box>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              我的面板
            </Typography>
          </Box>
        </ListItem>
        <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
          <Box
            component={Link}
            href='/apps/19'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover > *': { color: 'primary.main' }
            }}
          >
            <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
              <Icon icon='mdi:account-outline' fontSize={20} />
            </Box>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              个人档案
            </Typography>
          </Box>
        </ListItem>
      </List>
    </Box>
  )
}

const DefaultSuggestions = ({ setOpenDialog }: DefaultSuggestionsProps) => {
  return (
    <Grid container spacing={6} sx={{ ml: 0 }}>
      {defaultSuggestionsData.map((item, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Typography component='p' variant='overline' sx={{ lineHeight: 1.25, color: 'text.disabled' }}>
            {item.category}
          </Typography>
          <List sx={{ py: 2.5 }}>
            {item.suggestions.map((suggestionItem, index2) => (
              <ListItem key={index2} sx={{ py: 2 }} disablePadding>
                <Box
                  component={Link}
                  href={suggestionItem.link}
                  onClick={() => setOpenDialog(false)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 2.5 },
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover > *': { color: 'primary.main' }
                  }}
                >
                  <Icon icon={suggestionItem.icon} fontSize={20} />
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {suggestionItem.suggestion}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Grid>
      ))}
    </Grid>
  )
}

const AutocompleteComponent = ({ hidden, settings }: Props) => {
  // ** States
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [options, setOptions] = useState<AppBarSearchType[]>([])

  // ** Hooks & Vars
  const theme = useTheme()
  const router = useRouter()
  const { layout } = settings
  const wrapper = useRef<HTMLDivElement>(null)
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'))

  // Get all data using API
  useEffect(() => {
    axios
      .get(authConfig.backEndApiHost + 'menu_search.php', {
        params: { q: searchValue }
      })
      .then(response => {
        if (response.data && response.data.length) {
          setOptions(response.data)
        } else {
          setOptions([])
        }
      })
  }, [searchValue])

  useEffect(() => {
    if (!openDialog) {
      setSearchValue('')
    }
  }, [openDialog])

  useEffect(() => {
    setIsMounted(true)

    return () => setIsMounted(false)
  }, [])

  // Handle click event on a list item in search result
  const handleOptionClick = (obj: AppBarSearchType) => {
    setSearchValue('')
    setOpenDialog(false)
    if (obj.url) {
      router.push(obj.url)
    }
  }

  // Handle ESC & shortcut keys keydown events
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      // ** Shortcut keys to open searchbox (Ctrl + /)
      if (!openDialog && event.ctrlKey && event.which === 191) {
        setOpenDialog(true)
      }
    },
    [openDialog]
  )

  // Handle shortcut keys keyup events
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      // ** ESC key to close searchbox
      if (openDialog && event.keyCode === 27) {
        setOpenDialog(false)
      }
    },
    [openDialog]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp, handleKeydown])

  if (!isMounted) {
    return null
  } else {
    return (
      <Box
        ref={wrapper}
        onClick={() => !openDialog && setOpenDialog(true)}
        sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
      >
        <IconButton color='inherit' sx={!hidden && layout === 'vertical' ? { mr: 1, ml: -2.75 } : {}}>
          <Icon icon='mdi:magnify' />
        </IconButton>
        {!hidden && layout === 'vertical' ? (
          <Typography sx={{ userSelect: 'none', color: 'text.disabled' }}>搜索 (Ctrl+/)</Typography>
        ) : null}
        {openDialog && (
          <Dialog fullWidth open={openDialog} fullScreen={fullScreenDialog} onClose={() => setOpenDialog(false)}>
            <Box sx={{ top: 0, width: '100%', position: 'sticky' }}>
              <Autocomplete
                autoHighlight
                disablePortal
                options={options}
                id='appBar-search'
                isOptionEqualToValue={() => true}
                onInputChange={(event: any, value: string) => setSearchValue(value)}
                onChange={(event: SyntheticEvent<Element, Event>, value: unknown) => handleOptionClick(value as AppBarSearchType)}
                noOptionsText={<NoResult value={searchValue} setOpenDialog={setOpenDialog} />}
                getOptionLabel={(option: AppBarSearchType | unknown) => (option as AppBarSearchType).title}
                groupBy={(option: AppBarSearchType | unknown) =>
                  searchValue.length ? categoryTitle[(option as AppBarSearchType).category] : ''
                }
                sx={{
                  '& + .MuiAutocomplete-popper': {
                    ...(searchValue.length
                      ? {
                          overflow: 'auto',
                          maxHeight: 'calc(100vh - 69px)',
                          borderTop: `1px solid ${theme.palette.divider}`,
                          height: fullScreenDialog ? 'calc(100vh - 69px)' : 481,
                          '& .MuiListSubheader-root': { p: theme.spacing(3.75, 6, 0.75) }
                        }
                      : {
                          '& .MuiAutocomplete-listbox': { pb: 0 }
                        })
                  }
                }}
                renderInput={(params: AutocompleteRenderInputParams) => {
                  return (
                    <TextField
                      {...params}
                      value={searchValue}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                      inputRef={input => {
                        if (input) {
                          if (openDialog) {
                            input.focus()
                          } else {
                            input.blur()
                          }
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        sx: { p: `${theme.spacing(3.75, 6)} !important` },
                        startAdornment: (
                          <InputAdornment position='start' sx={{ color: 'text.primary' }}>
                            <Icon icon='mdi:magnify' />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            position='end'
                            onClick={() => setOpenDialog(false)}
                            sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                          >
                            {!hidden ? <Typography sx={{ mr: 2.5, color: 'text.disabled' }}>[esc]</Typography> : null}
                            <IconButton size='small' sx={{ p: 1 }}>
                              <Icon icon='mdi:close' fontSize={20} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )
                }}
                renderOption={(props: any, option: AppBarSearchType | unknown) => {
                  return searchValue.length ? (
                    <ListItem
                      {...props}
                      key={(option as AppBarSearchType).title}
                      className={`suggestion ${props.className}`}
                      onClick={() => handleOptionClick(option as AppBarSearchType)}
                      secondaryAction={<Icon icon='mdi:subdirectory-arrow-left' fontSize={20} />}
                      sx={{
                        '& .MuiListItemSecondaryAction-root': {
                          '& svg': {
                            cursor: 'pointer',
                            color: 'text.disabled'
                          }
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{
                          py: 2.5,
                          px: `${theme.spacing(6)} !important`,
                          '& svg': { mr: 2.5, color: 'text.primary' }
                        }}
                      >
                        <Icon fontSize={20} icon={(option as AppBarSearchType).icon || themeConfig.navSubItemIcon} />
                        <Typography variant='body2' sx={{ color: 'text.primary' }}>
                          {(option as AppBarSearchType).title}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  ) : null
                }}
              />
            </Box>
            {searchValue.length === 0 ? (
              <Box
                sx={{
                  p: 10,
                  display: 'grid',
                  overflow: 'auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  height: fullScreenDialog ? 'calc(100vh - 69px)' : '100%'
                }}
              >
                <DefaultSuggestions setOpenDialog={setOpenDialog} />
              </Box>
            ) : null}
          </Dialog>
        )}
      </Box>
    )
  }
}

export default AutocompleteComponent
