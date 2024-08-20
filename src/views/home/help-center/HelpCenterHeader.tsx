// MUI Imports
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import MuiTextField from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'

// Styles imports
import styles from './styles.module.css'

// Styled TextField component
const TextField = styled(MuiTextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--mui-palette-background-paper)'
  }
})

type Props = {
  searchValue: string
  setSearchValue: (value: string) => void
}

const HelpCenterHeader = ({ searchValue, setSearchValue }: Props) => {
  return (
    <section className={classnames('-mbs-[18%] sm:mbs-[-10%] lg:mbs-[-5%] md:mbs-[-8%]', styles.bgImage)}>
      <div
        className={classnames(
          'flex flex-col gap-4 items-center text-center pbs-[150px] lg:pbs-[180px] pbe-[40px] sm:pbe-[100px] pli-5'
        )}
      >
        <Typography variant='h4' color='primary'>
          Hello, how can we help?
        </Typography>
        <TextField
          className='is-full sm:max-is-[55%] md:max-is-[600px]'
          variant='outlined'
          placeholder='Ask a question...'
          value={searchValue}
          onChange={(e: any) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='ri-search-line' />
              </InputAdornment>
            )
          }}
        />
        <Typography className='mbe-6'>or choose a category to quickly find the help you need</Typography>
      </div>
    </section>
  )
}

export default HelpCenterHeader
