'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import type { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

import authConfig from '@configs/auth'

function Footer() {

  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  return (
    <footer className={frontLayoutClasses.footer}>
      <div className='relative'>
        <img
          src='/images/front-pages/footer-bg.png'
          alt='footer bg'
          className='absolute inset-0 is-full bs-full object-cover -z-[1]'
        />
        <div className={classnames('plb-12 text-white', frontCommonStyles.layoutSpacing)}>
          <Grid container rowSpacing={10} columnSpacing={12}>
            <Grid item xs={12} lg={5}>
              <div className='flex flex-col items-start gap-6'>
                <Link href='/home'>
                  <Logo color='var(--mui-palette-common-white)' />
                </Link>
                <Typography color='white' className='lg:max-is-[390px] opacity-[0.78]'>
                  A non-custodial Ao & Arweave wallet with powerful functions, supporting Chrome extension, Android, and iOS platforms.
                </Typography>
              </div>
            </Grid>
            {!isBelowLgScreen && (
              <Grid item xs={12} sm={3} lg={2}>
                <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                  正在开发中
                </Typography>
                <div className='flex flex-col gap-4'>
                  <Typography color='white' className='opacity-[0.78]'>
                    课程库
                  </Typography>
                  <Typography color='white' className='opacity-[0.78]'>
                    AI测验
                  </Typography>
                  <Typography color='white' className='opacity-[0.78]'>
                    知识库
                  </Typography>
                </div>
              </Grid>
            )}
            {!isBelowLgScreen && (
              <Grid item xs={12} sm={3} lg={2}>
                <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                  产品
                </Typography>
                <div className='flex flex-col gap-4'>
                  <Typography component={Link} href='/pptx' color='white' className='opacity-[0.78]'>
                    AI生成PPTX
                  </Typography>
                  <Typography component={Link} href='/chat' color='white' className='opacity-[0.78]'>
                    AI对话
                  </Typography>
                  <Typography component={Link} href='/mindmap' color='white' className='opacity-[0.78]'>
                    思维导图
                  </Typography>
                </div>
              </Grid>
            )}
            <Grid item xs={12} sm={6} lg={3}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                移动端
              </Typography>
              <div className='flex flex-col gap-4'>
                <Link className='bg-[#211B2C] bs-[56px] is-[211px] rounded'>
                  <div className='flex items-center pli-5 plb-[7px] gap-6'>
                    <img src='/images/front-pages/apple-icon.png' alt='apple store' className='bs-[34px]' />
                    <div className='flex flex-col items-start'>
                      <Typography variant='body2' color='white' className='capitalize opacity-[0.82]'>
                        Not Ready
                      </Typography>
                      <Typography color='white' className='font-medium capitalize opacity-[0.92]'>
                        App Store
                      </Typography>
                    </div>
                  </div>
                </Link>
                <Link className='bg-[#211B2C] bs-[56px] is-[211px] rounded'>
                  <div className='flex items-center pli-5 plb-[7px] gap-6'>
                    <img src='/images/front-pages/google-play-icon.png' alt='Google play' className='bs-[34px]' />
                    <div className='flex flex-col items-start'>
                      <Typography variant='body2' color='white' className='opacity-[0.82]'>
                        Not Ready
                      </Typography>
                      <Typography color='white' className='font-medium opacity-[0.92]'>
                        Google Play
                      </Typography>
                    </div>
                  </div>
                </Link>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
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

export default Footer
