// ** React Imports
import { useState, useEffect } from 'react'

// ** Config
import { authConfig, defaultConfig } from 'src/configs/auth'

import axios from 'axios'

// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const backEndApi = "api_data_interface.php"

  const [footerContent, SetFooterContent] = useState({"FOOTER_CONTENT":"","FOOTER_URL1_TEXT":"","FOOTER_URL1_LINK":"","FOOTER_URL2_TEXT":"","FOOTER_URL2_LINK":"","FOOTER_URL3_TEXT":"","FOOTER_URL3_LINK":"","FOOTER_URL4_TEXT":"","FOOTER_URL4_LINK":"","FOOTER_URL5_TEXT":"","FOOTER_URL5_LINK":""})

  useEffect(() => {
    const storedToken = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!
    axios
      .get(authConfig.backEndApiHost + backEndApi, { headers: { Authorization: storedToken }, params: {} })
      .then(res => {
        SetFooterContent(res.data)
        console.log("FooterContent", res.data)
      })
  }, [])

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {footerContent && footerContent.FOOTER_CONTENT}
        {' '}
        {footerContent && footerContent.FOOTER_URL1_TEXT && footerContent.FOOTER_URL1_LINK ?
          <Link target='_blank' href={footerContent.FOOTER_URL1_LINK}>
            {footerContent.FOOTER_URL1_TEXT}
          </Link>
          : ''
        }
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          {footerContent && footerContent.FOOTER_URL2_TEXT && footerContent.FOOTER_URL2_LINK ?
            <Link target='_blank' href={footerContent.FOOTER_URL2_LINK}>
              {footerContent.FOOTER_URL2_TEXT}
            </Link>
            : ''
          }
          {footerContent && footerContent.FOOTER_URL3_TEXT && footerContent.FOOTER_URL3_LINK ?
            <Link target='_blank' href={footerContent.FOOTER_URL3_LINK}>
              {footerContent.FOOTER_URL3_TEXT}
            </Link>
            : ''
          }
          {footerContent && footerContent.FOOTER_URL4_TEXT && footerContent.FOOTER_URL4_LINK ?
            <Link target='_blank' href={footerContent.FOOTER_URL4_LINK}>
              {footerContent.FOOTER_URL4_TEXT}
            </Link>
            : ''
          }
          {footerContent && footerContent.FOOTER_URL5_TEXT && footerContent.FOOTER_URL5_LINK ?
            <Link target='_blank' href={footerContent.FOOTER_URL5_LINK}>
              {footerContent.FOOTER_URL5_TEXT}
            </Link>
            : ''
          }
        </Box>
      )}
    </Box>
  )
}

export default FooterContent
