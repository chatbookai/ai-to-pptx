import { useState, useRef, createRef, useEffect } from 'react'
import pako from 'pako'
import base64js from 'base64-js'
import { SSE } from './utils/sse.js'
import { Ppt2Svg } from './utils/ppt2svg.js'
import { Ppt2Canvas } from './utils/ppt2canvas.js'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import PerfectScrollbar from 'react-perfect-scrollbar'

//import '../styles/GeneratePPTX.css'

let painter = null as Ppt2Svg
const canvasList = [] as any

function resetSize() {
    const width = Math.max(Math.min(document.body.clientWidth - 400, 1600), 480)
    painter.resetSize(width, width * 0.5625)
}

const GeneratePPTX = ({token, theme, params, pptxId, setPptxId, pptxObj, setPptxObj}: any) => {

    const [gening, setGening] = useState(false)
    const [descTime, setDescTime] = useState(0)
    const [descMsg, setDescMsg] = useState('正在生成中，请稍后...')
    const svg = useRef(null)
    const [pages, setPages] = useState([] as any)
    const [currentIdx, setCurrentIdx] = useState(0)

    console.log("GeneratePPTX descTime", descTime)
    console.log("GeneratePPTX descMsg", descMsg)
    console.log("GeneratePPTX pptxId", pptxId)

    const generatePptx = (outline: string, templateId: string) => {
        const timer = setInterval(() => {
            setDescTime(descTime => descTime + 1)
        }, 1000)
        setGening(true)
        const url = 'https://docmee.cn/api/ppt/generateContent'
        const source: any = new SSE(url, {
            method: 'POST',
            // withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'token': token
            },
            payload: JSON.stringify({ asyncGenPptx: true, outlineMarkdown: outline, templateId }),
        })
        source.onmessage = function (data: any) {
            const json = JSON.parse(data.data)
            if (json.pptId) {
                setDescMsg(`正在生成中，进度 ${json.current}/${json.total}，请稍后...`)
                asyncGenPptxInfo(json.pptId)
            }
        }
        source.onend = function (data: any) {
            if (data.data.startsWith('{') && data.data.endsWith('}')) {
                const json = JSON.parse(data.data)
                if (json.code != 0) {
                    alert('生成PPT异常：' + json.message)
                    return
                }
            }
            clearInterval(timer)
            setGening(false)
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

    const asyncGenPptxInfo = (id: string) => {
        setPptxId(id)
        const url = `https://docmee.cn/api/ppt/asyncPptInfo?pptId=${id}`
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.setRequestHeader('token', token)
        xhr.send()
        xhr.onload = function () {
            if (this.status === 200) {
                const resp = JSON.parse(this.responseText)
                const gzipBase64 = resp.data.pptxProperty
                const gzip = base64js.toByteArray(gzipBase64)
                const json = pako.ungzip(gzip, { to: 'string' })
                const _pptxObj = JSON.parse(json)
                setPptxObj(_pptxObj)
                drawPptxList(resp.data.current - 1, true)
            }
        }
        xhr.onerror = function (e) {
            console.error(e)
        }
    }
    
    const drawPptxList = (_idx?: number, asyncGen?: boolean) => {
        const idx = _idx || 0
        setCurrentIdx(idx)
        if(pptxObj)   {
            if (_idx == null || asyncGen) {
                const _pages = [] as any
                for (let i = 0; i < pptxObj.pages.length; i++) {
                    if (asyncGen && i > idx) {
                        break
                    }
                    _pages.push(pptxObj.pages[i])
                }
                setPages(_pages)
            } 
            else {
                setPages(pptxObj.pages || [])
            }
        }

        drawPptx(idx)
    }

    const drawPptx = (idx: number) => {
        if (pptxObj) {
            setCurrentIdx(idx);
            painter.drawPptx(pptxObj, idx);
        }
    };

    const loadById = (id: string) => {
        setGening(false)
        setPptxId(id)
        const url = 'https://docmee.cn/api/ppt/loadPptx?id=' + id
        console.log("pptInfo.url", url)
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
                console.log("pptInfo.pptxProperty", pptInfo.pptxProperty)
                setPptxObj(pptInfo.pptxProperty)
                setPages(pptInfo.pptxProperty.pages)

                const loadingPageId = 0
                setCurrentIdx(loadingPageId);
                painter.drawPptx(pptInfo.pptxProperty, loadingPageId);
                
            }
        }
        xhr.onerror = function (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (gening && currentIdx > 0) {
            canvasList[currentIdx - 1].current.scrollIntoView(true)
        } else if (canvasList.length > 0 && currentIdx == 0) {
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
                    _ppt2Canvas.drawPptx(pptxObj, i)
                } catch(e) {
                    console.log('渲染第' + (i + 1) + '页封面异常', e)
                }
            }
        }
    }, [gening, pages])

    useEffect(() => {
        // svg
        painter = new Ppt2Svg(svg.current)
        painter.setMode('edit')
      
        let mTimer = 0
        window.addEventListener('resize', function() {
          mTimer && clearTimeout(mTimer)
          mTimer = setTimeout(() => {
            resetSize()
          }, 50)
        })
      
        resetSize()
      
        const _pptxId = pptxId // new URLSearchParams(window.location.search).get('pptxId')
        console.log("_pptxId", _pptxId)
        if (_pptxId) {
          loadById(_pptxId)
        } else {
          generatePptx(params.outline, params.templateId)
        }
    }, [pptxId])

    return (
      <>
        <Box sx={{ 
            m: 3,
            p: 1,
            borderRadius: 1,
            border: `2px dashed ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.22)' : 'rgba(247, 244, 254, 0.14)'}`,
            overflowX: 'hidden', 
            height: '800px',
            width: '95%'
        }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid item sx={{ height: '100%', width: '332px' }}>
                    <Box sx={{ p: 2, overflowX: 'hidden', overflowY: 'auto', height: '100%' }}>
                        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
                            {pages.map((page: any, index: number) => {
                                canvasList[index] = createRef();
                                console.log("PerfectScrollbar page", page)
                                return (
                                    <Box key={index} onClick={() => drawPptx(index)} sx={{ cursor: 'pointer' }}>
                                        <canvas ref={canvasList[index]} width="288" height="162" className={currentIdx == index ? 'left_div_item_img ppt_select' : 'left_div_item_img'} />
                                    </Box>
                                );
                            })}
                            {gening && currentIdx > 0 && (
                                <div className="left_div_item">
                                    <div className="left_div_item_index">{ currentIdx + 2 }</div>
                                    <div className="left_div_item_img img_gening">生成中...</div>
                                </div>
                            )}
                        </PerfectScrollbar>
                    </Box>
                </Grid>
                <Grid item xs={8} sx={{  }}>
                    <Box sx={{ mt: 2, overflowX: 'hidden', width: '100%', overflowY: 'hidden', display: 'grid', placeItems: 'center' }}>
                        <Box sx={{ width: '100%' }}>
                            <svg ref={svg} style={{ width: "100%" }} className="right_canvas"></svg>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
      </>
    )
}

export default GeneratePPTX
