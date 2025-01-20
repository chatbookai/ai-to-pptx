import { useState, useRef, createRef, useEffect } from 'react'
import pako from 'pako'
import base64js from 'base64-js'
import { SSE } from 'src/functions/AiPPTX/sse'
import { Ppt2Svg } from 'src/functions/AiPPTX/ppt2svg'
import { Ppt2Canvas } from 'src/functions/AiPPTX/ppt2canvas'
import { BackendApi } from './Config'

import Button from '@mui/material/Button'
import Box from '@mui/material/Grid'
import Typography from '@mui/material/Grid'
import Grid from '@mui/material/Grid'

import { Download } from "@mui/icons-material"
import { SwapHoriz } from '@mui/icons-material'
import { ChangeCircle } from '@mui/icons-material'

let pptxObj = null as any
let painter = null as any
const canvasList = [] as any

const resetSize = () => {
    const width = Math.max(Math.min(document.body.clientWidth - 560, 1100), 480)
    painter.resetSize(width, width * 0.5625)
}

const StepFiveGeneratePpt = ({setActiveStep, inputData, setInputData, token}: any) => {

  const [generatePptxStatus, setGeneratePptxStatus] = useState(false)
  const [descTime, setDescTime] = useState(0)
  const [descMsg, setDescMsg] = useState('正在生成中，请稍后...')
  const svg = useRef(null)
  const [pages, setPages] = useState([] as any)
  const [currentIdx, setCurrentIdx] = useState(0)

  const changePptxTemplate = (pptxId: string, templateId: string) => {
    pptxObj = null
    setCurrentIdx(0)
    asyncGenPptxInfo(pptxId, templateId)
  }

  const generatePptxFromBeginning = () => {
    pptxObj = null
    setCurrentIdx(0)
    setActiveStep(0)
    setInputData({selectedOption: "inputTopic", inputText: "", importOption: "inputText", moreOption:{language:"zh-CN", moreRequirement:"", outlineLength:"regular" }, outlineContent: '', outlineHtml: '', templateId: 0, pptxContent: null, dataUrl: ''})
  }

  const generateNewPptx = (templateId: string, outlineContent: string, dataUrl: string) => {
      const timer = setInterval(() => {
          setDescTime(descTime => descTime + 1)
      }, 1000)
      setGeneratePptxStatus(true)
      const url = BackendApi + 'generateContent.php'
      const source = new SSE(url, {
          method: 'POST',
          headers: {
              'token': token,
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json'
          },
          payload: JSON.stringify({ asyncGenPptx: true, templateId, outlineMarkdown: outlineContent, dataUrl }),
      }) as any
      source.onmessage = function (data: any) {
          const json = JSON.parse(data.data)
          if (json.pptId) {
              setDescMsg(`正在生成中，进度 ${json.current}/${json.total}，请稍后...`)
              asyncGenPptxInfo(json.pptId, templateId)
          }
      }
      source.onend = function (data: any) {
          if (data.data.startsWith('{') && data.data.endsWith('}')) {
              const json = JSON.parse(data.data)
              if (json.code != 0) {
                  alert('生成PPT异常：' + json.message)

                  return
              }
              else {
                console.log("json.data", json.data)
                setInputData((prevState: any) => ({...prevState, pptxContent: json.data}))
              }
          }
          clearInterval(timer)
          setGeneratePptxStatus(false)
          setDescMsg('正在生成中，请稍后...')
          setTimeout(() => {
              drawPptxList(0, false)
          }, 200)
      }
      source.onerror = function (err: any) {
          clearInterval(timer)
          console.error('生成内容异常', err)
          alert('生成内容异常')
      }
      source.stream()
  }

  const asyncGenPptxInfo = (id: string, templateId: string) => {
      setInputData((prevState: any) => ({...prevState, pptxId: id}))
      const currentId = pptxObj && pptxObj.pages ? pptxObj.pages.length : 0
      const url = `${BackendApi}asyncPptInfo.php?currentId=${currentId}&pptId=${id}&templateId=${templateId}`
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.setRequestHeader('token', token)
      xhr.send()
      xhr.onload = function () {
          if (this.status === 200) {
            try {
              const resp = JSON.parse(this.responseText)
              const gzipBase64 = resp.data.pptxProperty
              const gzip = base64js.toByteArray(gzipBase64)
              const json = pako.ungzip(gzip, { to: 'string' })
              const _pptxObj = JSON.parse(json)
              if (pptxObj && pptxObj.pages && _pptxObj && _pptxObj.pages) {
                  Object.entries(_pptxObj.pages).forEach(([key, value]) => {
                      const index = Number(key);
                      if (!pptxObj.pages[index]) {
                          pptxObj.pages[index] = value;
                      }
                  });
              }
              else {
                  pptxObj = _pptxObj
              }
              console.log("pptxObj.pages", pptxObj.pages)
              if(resp.data.current == resp.data.total)  {
                drawPptxList(0, false)
              }
              else {
                drawPptxList(resp.data.current - 1, true)
              }
              console.log("json.data _pptxObj", _pptxObj)
              setInputData((prevState: any) => ({...prevState, pptxContent: _pptxObj}))

            }
            catch(e: any) {
              console.log("asyncGenPptxInfo JSON.parse(this.responseText) Failed:", e);
            }
          }
      }
      xhr.onerror = function (e) {
          console.error(e)
      }
  }

  const drawPptxList = (_idx?: number, asyncGen?: boolean) => {
      const idx = _idx || 0
      setCurrentIdx(idx)
      if (_idx == null || asyncGen) {
          const _pages = [] as any
          for (let i = 0; i < pptxObj.pages.length; i++) {
              if (asyncGen && i > idx) {
                  break
              }
              _pages.push(pptxObj.pages[i])
          }
          setPages(_pages)
          drawPptx(idx)
      }
      else {
        if(pptxObj && pptxObj.pages)  {
          setPages(pptxObj.pages)
          drawPptx(0)
        }
        else {
          setPages([])
        }
      }
  }

  const drawPptx = (idx: number) => {
      setCurrentIdx(idx)

      //console.log("pptxObj", pptxObj, idx)
      painter.drawPptx(pptxObj, idx)
  }

  const downloadPptx = (id: string) => {
      const url = BackendApi + 'downloadPptx.php'
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      xhr.setRequestHeader('token', token)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify({ id }))
      xhr.onload = function () {
          if (this.status === 200) {
              const resp = JSON.parse(this.responseText)
              const fileUrl = BackendApi + resp.data.fileUrl
              const a = document.createElement('a')
              a.href = fileUrl
              a.download = (resp.data.subject || 'download') + '.pptx'
              a.click()
          }
      }
      xhr.onerror = function (e) {
          console.error(e)
      }
  }

  const loadById = (id: string) => {
      setGeneratePptxStatus(false)
      setInputData((prevState: any) => ({...prevState, pptxId: id}))
      const url = BackendApi + 'loadPptx?id=' + id
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.setRequestHeader('token', token)
      xhr.send()
      xhr.onload = function () {
          if (this.status === 200) {
              const resp = JSON.parse(this.responseText)
              if (resp.code != 0) {
                  alert(resp.message)

                  return
              }
              const pptInfo = resp.data.pptInfo
              const gzipBase64 = pptInfo.pptxProperty
              const gzip = base64js.toByteArray(gzipBase64)
              const json = pako.ungzip(gzip, { to: 'string' })
              pptInfo.pptxProperty = JSON.parse(json)
              pptxObj = pptInfo.pptxProperty
              drawPptxList()
          }
      }
      xhr.onerror = function (e) {
          console.error(e)
      }
  }

  useEffect(() => {
      if (generatePptxStatus && currentIdx > 0) {
          if(canvasList[currentIdx - 1] && canvasList[currentIdx - 1].current)  {
              canvasList[currentIdx - 1].current.scrollIntoView(true)
          }
      } else if (canvasList.length > 0 && currentIdx == 0 && canvasList[0].current) {
          canvasList[0].current.scrollIntoView(true)
      }
      if (canvasList.length > 0) {
          for (let i = 0; i < pages.length; i++) {
              const imgCanvas = canvasList[i].current
              if (!imgCanvas) {
                  continue
              }
              try {
                  const _ppt2Canvas = new Ppt2Canvas(imgCanvas)
                  if(pptxObj && pptxObj.pages)   {
                      _ppt2Canvas.drawPptx(pptxObj, i)
                  }
              } catch(e) {
                  console.log('渲染第' + (i + 1) + '页封面异常', e)
              }
          }
      }
  }, [generatePptxStatus, pages])

  useEffect(() => {
      // svg
      painter = new Ppt2Svg(svg.current)
      painter.setMode('edit')

      let mTimer: NodeJS.Timeout | null = null;
      window.addEventListener('resize', function() {
        mTimer && clearTimeout(mTimer)
        mTimer = setTimeout(() => {
          resetSize()
        }, 50)
      })

      resetSize()

      const _pptxId = new URLSearchParams(window.location.search).get('pptxId')
      if (_pptxId) {
        loadById(_pptxId)
      }
      else {
        if(inputData.pptxContent == null) {
          generateNewPptx(inputData.templateId, inputData.outlineContent, inputData.dataUrl)
        }
        else {
          changePptxTemplate(inputData.pptxId, inputData.templateId)
        }
      }
  }, [])


  console.log("svg", svg)

  return (
    <>
      <div style={{paddingLeft: '1em', paddingTop: '-1.25em'}}>
          <div style={{
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      flexShrink: 0,
                      height: 'calc(100vh - 216px)',
                      justifyContent: 'center',
                      position: 'absolute',
                      width: '115px',
                    }}>
              <div style={{
                          borderRadius: '6px',
                          marginLeft: '12px',
                          height: 'calc(100vh - 216px)',
                          width: '190px',
                        }}>
                  <div style={{
                              height: 'calc(100vh - 216px)',
                              overflowX: 'hidden',
                              overflowY: 'auto',
                              padding: '0 8px 0 2px',
                            }}>
                      {pages.map((page: any, index: number) => {
                          canvasList[index] = createRef()

                          return (
                              <div style={{ display: 'flex', cursor: 'pointer', margin: '10px 2px 10px 3px' }} key={index} onClick={() => drawPptx(index)}>
                                  <div style={{
                                        color: '#8d90a5',
                                        flexShrink: 0,
                                        paddingRight: 6,
                                        paddingTop: 30,
                                        textAlign: 'right',
                                        width: 23,
                                      }}>{ index + 1 }</div>
                                  <canvas
                                    ref={canvasList[index]}
                                    width="288"
                                    height="162"
                                    style={{
                                      height: 81,
                                      width: 144,
                                      border: currentIdx == index ? '2px solid #491ff8;' : '1px solid #ccc',
                                      backgroundColor: '#f3f3f3'
                                    }}
                                  />
                              </div>
                          )
                      })}
                      {generatePptxStatus && currentIdx > 0 && (
                          <div style={{ display: 'flex', cursor: 'pointer', margin: '10px 2px 10px 3px' }}>
                              <div style={{
                                        color: '#8d90a5',
                                        flexShrink: 0,
                                        paddingRight: 6,
                                        paddingTop: 30,
                                        textAlign: 'right',
                                        width: 23,
                                      }}>{ currentIdx + 2 }</div>
                              <div style={{
                                    height: 81,
                                    width: 144,
                                    border: '1px solid #ccc',
                                    textAlign: 'center',
                                    lineHeight: 81,
                                    color: '#666',
                                    cursor: 'default',
                                  }}>生成中...</div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
          <Grid sx={{my: 2}}>
              <Grid container justifyContent="right">
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {generatePptxStatus && (
                      <Box sx={{ mr: 2 }}>
                        <Typography component="span">
                          {descMsg}
                        </Typography>
                        <Typography component="span" sx={{ marginLeft: '5px' }}>
                          {descTime}秒
                        </Typography>
                      </Box>
                    )}
                    <Button
                      size={'small'}
                      disabled={generatePptxStatus}
                      variant="outlined"
                      onClick={() => {
                        setActiveStep(3)
                      }}
                      startIcon={<SwapHoriz />}
                      sx={{mx: 1}}
                    >
                      更换模板
                    </Button>
                    <Button
                      size={'small'}
                      disabled={generatePptxStatus}
                      variant={"contained"}
                      onClick={() => downloadPptx(inputData.pptxId) }
                      startIcon={<Download />}
                      sx={{mx: 1}}
                      >
                      下载
                    </Button>
                    <Button
                      size={'small'}
                      disabled={generatePptxStatus}
                      variant={"outlined"}
                      onClick={() => generatePptxFromBeginning()}
                      startIcon={<ChangeCircle />}
                      sx={{mx: 1}}
                      >
                      重新生成
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <Grid sx={{ ml: '180px', mt: 2 }}>
                  <svg ref={svg} style={{ margin: '0 auto', display: 'block', border: '1px solid #666', backgroundColor: '#f3f3f3' }}></svg>
              </Grid>
          </Grid>
      </div>
    </>
  )
}

export default StepFiveGeneratePpt
