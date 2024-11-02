import { useState, useRef, createRef, useEffect, useCallback } from 'react'
import pako from 'pako'
import base64js from 'base64-js'
import { SSE } from '../utils/sse.js'
import { Ppt2Svg } from '../utils/ppt2svg.js'
import { Ppt2Canvas } from '../utils/ppt2canvas.js'
import '../styles/GeneratePpt.css'

import authConfig from '@configs/auth'

let pptxObj = null as any
let painter = null as any
const canvasList = [] as any

function resetSize() {
    const width = Math.max(Math.min(document.body.clientWidth - 400, 1600), 480)
    painter.resetSize(width, width * 0.5625)
}

function GeneratePpt({token, params}: { token: string, params: any }) {

    const [gening, setGening] = useState(false)
    const [descTime, setDescTime] = useState(0)
    const [descMsg, setDescMsg] = useState('正在生成中，请稍后...')
    const svg = useRef(null)
    const [pptxId, setPptxId] = useState('')
    const [pages, setPages] = useState([] as any)
    const [currentIdx, setCurrentIdx] = useState(0)

    const generatePptx = useCallback((templateId: string, outline: string, dataUrl: string) => {
        const timer = setInterval(() => {
            setDescTime(descTime => descTime + 1)
        }, 1000)
        setGening(true)
        const url = authConfig.AppUrl + '/aipptx/generateContent.php'
        const source = new SSE(url, {
            method: 'POST',
            headers: {
                'token': token,
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            },
            payload: JSON.stringify({ asyncGenPptx: true, templateId, outlineMarkdown: outline, dataUrl }),
        }) as any
        source.onmessage = function (data: any) {
          if(data.data)  {
            try {
              const jsonData = JSON.parse(data.data)
              jsonData.choices.forEach((choice: any) => {
                if (choice.delta && choice.delta.content) {
                  console.log("choice.delta.content:", choice.delta.content)
                }
              });
            }
            catch(Error: any) {

            }
          }

            //if (json.pptId) {
            //    setDescMsg(`正在生成中，进度 ${json.current}/${json.total}，请稍后...`)
            //    asyncGenPptxInfo(json.pptId)
            //}
        }
        source.onend = function (data: any) {
            if (data.data.startsWith('{') && data.data.endsWith('}')) {
                const json = JSON.parse(data.data)
                if (json.code != 0) {
                    console.error('生成PPT异常：' + json.message)

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
        }
        source.stream()
    }, [token])

    const asyncGenPptxInfo = useCallback((id: string) => {
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
                pptxObj = _pptxObj
                drawPptxList(resp.data.current - 1, true)
            }
        }
        xhr.onerror = function (e) {
            console.error(e)
        }
    }, [token])

    const drawPptxList = useCallback((_idx?: number, asyncGen?: boolean) => {
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
        } else {
            setPages(pptxObj.pages || [])
        }

        drawPptx(idx)
    }, [token])

    const drawPptx = useCallback((idx: number) => {
        setCurrentIdx(idx)
        painter.drawPptx(pptxObj, idx)
    }, [])

    const downloadPptx = useCallback((id: string) => {
        const url = 'https://docmee.cn/api/ppt/downloadPptx'
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url, true)
        xhr.setRequestHeader('token', token)
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
    }, [token])

    const loadById = useCallback((id: string) => {
        setGening(false)
        setPptxId(id)
        const url = 'https://docmee.cn/api/ppt/loadPptx?id=' + id
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.setRequestHeader('token', token)
        xhr.send()
        xhr.onload = function () {
            if (this.status === 200) {
                const resp = JSON.parse(this.responseText)
                if (resp.code != 0) {
                    console.error(resp.message)

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
    }, [token])

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

        const _pptxId = new URLSearchParams(window.location.search).get('pptxId')
        if (_pptxId) {
          loadById(_pptxId)
        } else {
          generatePptx(params.templateId, params.outline, params.dataUrl)
        }
    }, [token])

    return (
      <>
        <div className="ppt_content">
            {gening &&
            <div className="ppt_desc">
                <span>{descMsg}</span>
                <span style={{ marginLeft: '5px' }}>{descTime}秒</span>
            </div>}
            <div className="left_div">
                <div className="left_div_child">
                    <div className="left_div_child_child">
                        {pages.map((page: any, index: number) => {
                            canvasList[index] = createRef()

                            return (
                                <div className="left_div_item" key={index} onClick={() => drawPptx(index)}>
                                    <div className="left_div_item_index">{ index + 1 }</div>
                                    <canvas ref={canvasList[index]} width="288" height="162" className={currentIdx == index ? 'left_div_item_img ppt_select' : 'left_div_item_img'} />
                                </div>
                            )
                        })}
                        {gening && currentIdx > 0 && (
                            <div className="left_div_item">
                                <div className="left_div_item_index">{ currentIdx + 2 }</div>
                                <div className="left_div_item_img img_gening">生成中...</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="right_div">
                {!gening && pptxId && <a className="ppt_download" onClick={() => downloadPptx(pptxId)}>下载</a>}
                <div style={{ marginLeft: '200px' }}>
                    <svg ref={svg} className="right_canvas"></svg>
                </div>
            </div>
        </div>
      </>
    )
}

export default GeneratePpt
