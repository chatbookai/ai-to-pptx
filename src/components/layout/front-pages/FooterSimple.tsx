'use client'

// MUI Imports
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

import authConfig from '@configs/auth'

function FooterSimple() {

  return (
    <footer className={frontLayoutClasses.footer}>
      <div className='bg-[#211B2C]'>
        <div
          className={classnames(
            'flex flex-wrap items-center justify-center sm:justify-between gap-4 plb-[15px]',
            frontCommonStyles.layoutSpacing
          )}
        >
          <p className='text-white text-[13px] opacity-[0.92]'>
            <span>{`© ${new Date().getFullYear()}, Made with `}</span>
            <span>{`❤️`}</span>
            <span>{` by `}</span>
            <Link href={authConfig.AppGithub} target='_blank' className='font-medium text-white'>
              {authConfig.AppName}
            </Link>
          </p>
          <div className='flex gap-6 items-center opacity-[0.78]'>
            <IconButton component={Link} size='small' href={authConfig.AppGithub} target='_blank'>
              <i className='ri-github-fill text-white text-lg' />
            </IconButton>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterSimple
