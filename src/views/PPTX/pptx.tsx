'use client'

// ** React Imports
import { useState, useEffect } from 'react'

// ** Axios Imports
import axios from 'axios'
import authConfig from '@configs/auth'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import ReactMarkdown from 'react-markdown'
import CardMedia from '@mui/material/CardMedia'
import { useTheme } from '@mui/material/styles'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { useSettings } from '@core/hooks/useSettings'
import { downloadJson } from '@/configs/functions'

import GeneratePPTX from './GeneratePPTX'

// @ts-ignore
import "./lib/chart.js";

// @ts-ignore
import "./lib/geometry.js";

// @ts-ignore
import "./lib/ppt2canvas.js";

// @ts-ignore
import "./lib/ppt2svg.js";

// @ts-ignore
import "./lib/sse.js";

const apiKey = 'ak_6J8HQorE3rE6vt_Iyy'
const uid = 'test'

const PPTXModel = () => {
  
  const { t } = useTranslation()

  //const auth = useAuth()
  //const router = useRouter()
  //useEffect(() => {
    //CheckPermission(auth, router, false)
    //handleGetRandomTemplates()
  //}, [])
  
  const theme = useTheme()
  const { settings } = useSettings()
  const { skin } = settings
  
  const [templateId, setTemplateId] = useState('')
  
  // ** State
  const [pptxOutline, setPptxOutline] = useState<string>('');
  const [pptxOutlineResult, setPptxOutlineResult] = useState<string>('');
  const [pptxOutlineError, setPptxOutlineError] = useState<string>('');
  const [pptxRandomTemplates, setPptxRandomTemplates] = useState<any[]>([]);
  const [pptxRandomTemplates6, setPptxRandomTemplates8] = useState<any[]>([]);
  const [pptxObj, setPptxObj] = useState<any>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isDisabledText, setIsDisabledText] = useState<string>(t('Download PPTX') as string);
  const [step, setStep] = useState<number>(1);
  const [pptxId, setPptxId] = useState('1826136781784080384')
  
  const [token, setToken] = useState<string>('token')

  async function createApiToken() {
    try {
      const url = 'https://docmee.cn/api/user/createApiToken'
      const resp = await (await fetch(url, {
        method: 'POST',
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid,
          limit: null
        })
      })).json()
      
      console.log("resp", resp)
      if(resp && resp.data && resp.data.token)  {
        setToken(resp.data.token)
      }
    }
    catch(Error: any) {
      console.log("createApiToken Error", Error)
    }
  }

  const [windowWidth, setWindowWidth] = useState('1152px');
  useEffect(() => {

    //createApiToken()

    const handleResize = () => {
      if(window.innerWidth >=1920)   {
        setWindowWidth('1392px');
      }
      else if(window.innerWidth < 1920 && window.innerWidth > 1440)   {
        setWindowWidth('1152px');
      }
      else if(window.innerWidth <= 1440 && window.innerWidth > 1200)   {
        setWindowWidth('1152px');
      }
      else {
        setWindowWidth('1152px');
      }
    };
    
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const handleGetRandomTemplates = async () => {
    try {

      const url = 'https://docmee.cn/api/ppt/randomTemplates'
      const GetRandomTemplatesData = await axios.post(url, {
          page: 1,
          size: 10,
          filters: { type: 1 }
      }, {
          headers: {
              'satoken': token,
              'Content-Type': 'application/json'
          }
      }).then(res=>res.data);
      console.log("GetRandomTemplatesData", GetRandomTemplatesData)
      if(GetRandomTemplatesData && GetRandomTemplatesData.data && GetRandomTemplatesData.data.length > 0) {
        setPptxRandomTemplates(GetRandomTemplatesData.data)
        setPptxRandomTemplates8(GetRandomTemplatesData.data.splice(0, 8))
        console.log("pptxRandomTemplates", pptxRandomTemplates)
      }
    }
    catch(Error: any) {
      console.log("handleGetRandomTemplates Error", Error)
    }
  }

  const handleGenerateOutline = async () => {
    try {
      setPptxRandomTemplates([])
      setPptxRandomTemplates8([])
      setGenerating(true)

      setIsDisabled(true)
      setStep(0)
      if(pptxOutline == '') {
        setPptxOutlineError('PPTX Outline must input')

        return
      }
      if(pptxOutline.length < 3) {
        setPptxOutlineError('PPTX Outline subject is too short')

        return
      }
      setPptxOutlineError('')

      //const url = 'https://docmee.cn/api/ppt/generateOutline'
      const url = authConfig.AppUrl + '/ai/pptx/generateOutline.php'
      let outline = ''
      const source: any = new window.SSE(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'satoken': 'satoken',
        },
        payload: JSON.stringify({ action: 'stream', subject: pptxOutline }),
      })
      console.log("source", source)
      source.onmessage = function (data: any) {
          try {
            if(data.data != "[DONE]")  {
              const jsonData = JSON.parse(data.data)
              if(jsonData.choices && jsonData.choices[0] && jsonData.choices[0].delta.content) {
                outline += jsonData.choices[0].delta.content
                //console.log("json.choices[0].delta.content", outline)
                setPptxOutlineResult(outline)
              }
              window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight })
            }
          }
          catch(e: any) {
            console.log("handleGenerateOutline Error", e)
          }
      }
      source.onend = function (data: any) {
          //console.log("onend", data.data)
          console.log("pptxOutlineResult", pptxOutlineResult)
      }
      source.onerror = function (err: any) {
          console.error('生成大纲异常', err)
      }
      source.stream()

      setGenerating(false)
      //handleGetRandomTemplates()
    }
    catch(Error: any) {
      console.log("handleGenerateOutline Error", Error)
    }

  }
  
  const handleDownloadJson = () => {
    //setIsDisabled(true)

    downloadJson(pptxObj, pptxOutline ?? 'Unknown Name ' + ' Demo')

    //setIsDisabled(false)
  }

  const handleDownloadPPTX = (id: string) => {
      setIsDisabledText('Downloading')
      const url = 'https://docmee.cn/api/ppt/downloadPptx'
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      xhr.setRequestHeader('satoken', token)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify({ id }))
      xhr.onload = function () {
          if (this.status === 200) {
              const resp = JSON.parse(this.responseText)
              const fileUrl = resp.data.fileUrl
              const a = document.createElement('a')
              a.href = fileUrl
              a.download = (resp.data.subject || 'download') + '.pptx'
              a.click()
          }
      }
      xhr.onerror = function (e) {
          console.error(e)
      }
      setIsDisabledText('Download PPTX')
  }

  return (
    <Grid container sx={{margin: '0 auto'}} maxWidth={windowWidth}>
      <Box
        className='app-chat'
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 1,
          overflow: 'hidden',
          my: 6,
          backgroundColor: 'background.paper',
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
        }}
      >
        <Grid item xs={12} sx={{ my: 3, ml: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              size="small"
              label={`${t('Subject')}`}
              placeholder={pptxOutlineError}
              value={pptxOutline}
              onChange={(e) => setPptxOutline(e.target.value)}
              error={!!pptxOutlineError}
            />
            <Button size="small" disabled={generating} variant='contained' style={{ marginLeft: '10px' }} onClick={() => handleGenerateOutline()}>
              {t("Generate")}
            </Button>
            <FormHelperText style={{ color: 'error.main', marginLeft: '10px' }}>{pptxOutlineError}</FormHelperText>
            <Button variant='outlined' size="small" disabled={!isDisabled} style={{ marginLeft: '10px' }} onClick={() => handleDownloadJson()}>
              Download Json
            </Button>
            <Button variant='contained' size="small" disabled={!isDisabled} style={{ marginLeft: '10px' }} onClick={() => handleDownloadPPTX(pptxId)}>
              {isDisabledText}
            </Button>
          </div>
        </Grid>

        {step == 0 && token != '' && (
            <Grid item xs={12} sx={{ mt: 3, mb: 22 }}>
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <Box sx={{ 
                    m: 3,
                    p: 3,
                    borderRadius: 1,
                    border: `2px dashed ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.22)' : 'rgba(247, 244, 254, 0.14)'}`,
                    overflowX: 'hidden', 
                    height: '100%',
                    width: '95%'
                  }}>
                    <ReactMarkdown>{pptxOutlineResult.replaceAll('```', '')}</ReactMarkdown>
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <Box sx={{ 
                    m: 3,
                    p: 3,
                    borderRadius: 1,
                    border: `2px dashed ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.22)' : 'rgba(247, 244, 254, 0.14)'}`,
                    overflowX: 'hidden', 
                    height: '100%',
                    width: '95%'
                  }}>
                    <Grid container spacing={2}>
                      {pptxRandomTemplates6 && pptxRandomTemplates6.length > 0 && pptxRandomTemplates6.map((item, index) => (
                        <Grid item xs={6} key={index}>
                          <Box position="relative" sx={{ mb: 2, mr: 2 }}>
                            <CardMedia image={`${item.coverUrl + '?token=' + token}`} onClick={()=>{
                              setStep(1)
                              setTemplateId(item.id)
                            }} sx={{ height: '8.25rem', objectFit: 'contain', borderRadius: 1 }} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
        )}

        {step == 1 && token != '' && (
          <Grid item xs={12} sx={{ mt: 3, mb: 22 }}>
            <GeneratePPTX token={token} theme={theme} pptxId={pptxId} setPptxId={setPptxId} pptxObj={pptxObj} setPptxObj={setPptxObj} params={{ outline: pptxOutlineResult, templateId }} />
          </Grid>
        )}

      </Box>
    </Grid>
  )
}

export default PPTXModel

