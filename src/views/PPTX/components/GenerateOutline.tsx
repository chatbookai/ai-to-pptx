import { useState, useEffect, useCallback } from 'react'
import OutlineEdit from './OutlineEdit'
import { marked } from 'marked'
import { SSE } from '../utils/sse.js'
import '../styles/GenerateOutline.css'

let outline = ''
let dataUrl = ''
let outlineTree = null as any

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    async: false,
    breaks: false,
    pedantic: false,
    silent: true
})

function GenerateOutline({token, nextStep}: { token: string, nextStep: (params: any) => void}) {
    const [selectType, setSelectType] = useState('subject')
    const [subject, setSubject] = useState('')
    const [text, setText] = useState('')

    // 生成状态: 0未开始 1生成中 2已完成
    const [genStatus, setGenStatus] = useState(0)
    const [outlineHtml, setOutlineHtml] = useState('')

    const parseFileData = useCallback((formData: FormData) => {
        const url = 'https://docmee.cn/api/ppt/parseFileData'
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url, false)
        xhr.setRequestHeader('token', token)
        xhr.send(formData)
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const resp = JSON.parse(xhr.responseText)
                if (resp.code != 0) {
                    alert('解析文件异常：' + resp.message)

                    return null
                }

                return resp.data.dataUrl
            } else {
                alert('解析文件网络异常, httpStatus: ' + xhr.status)

                return null
            }
        }
    }, [token])

    const generateOutline = useCallback(() => {
        if (genStatus != 0) {
            return
        }
        setGenStatus(1)
        setOutlineHtml('<h3>正在生成中，请稍后....</h3>')
        const inputData = {} as any
        if (selectType == 'subject') {
            // 根据主题
            if (!subject) {
                alert('请输入主题')
                setGenStatus(0)

                return
            }
            inputData.subject = subject
        } else if (selectType == 'text') {
            // 根据内容
            if (!text) {
                alert('请输入内容')
                setGenStatus(0)

                return
            }
            const formData = new FormData()
            formData.append('content', text)
            inputData.dataUrl = parseFileData(formData)
        } else if (selectType == 'file') {
            // 根据文件
            const file = (document.getElementById('input_file') as any)?.files[0]
            if (!file) {
                alert('请选择文件')
                setGenStatus(0)

                return
            }
            const formData = new FormData()
            formData.append('file', file)
            inputData.dataUrl = parseFileData(formData)
        }
        if (!inputData.subject && !inputData.dataUrl) {
            setGenStatus(0)

            return
        }
        setGenStatus(1)
        dataUrl = inputData.dataUrl
        const url = 'https://docmee.cn/api/ppt/generateOutline'
        const source = new SSE(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'token': token
            },
            payload: JSON.stringify(inputData),
        }) as any
        source.onmessage = function (data: any) {
            const json = JSON.parse(data.data)
            if (json.status == -1) {
                alert('生成大纲异常：' + json.error)
                setGenStatus(0)

                return
            }
            if (json.status == 4 && json.result) {
                outlineTree = json.result
            }
            outline = outline + json.text
            const outlineHtml = marked.parse(outline.replace('```markdown', '').replace(/```/g, '')) as string
            setOutlineHtml(outlineHtml)
        }
        source.onend = function (data: any) {
            if (data.data.startsWith('{') && data.data.endsWith('}')) {
                const json = JSON.parse(data.data)
                if (json.code != 0) {
                    alert('生成大纲异常：' + json.message)
                    setGenStatus(0)

                    return
                }
            }
            setGenStatus(2)
        }
        source.onerror = function (err: any) {
            console.error('生成大纲异常', err)
            alert('生成大纲异常')
            setGenStatus(0)
        }
        source.stream()
    }, [token, selectType, genStatus, subject, text])

    useEffect(() => {
        if (outlineHtml) {
            window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight })
        }
    }, [outlineHtml])

    useEffect(() => {
        genStatus == 2 && window.scrollTo(0, 0)
    }, [genStatus])

    return (
      <>
        <div className="outline_content">
            <h1>🤖 AI智能生成PPT演示文稿</h1>
            <div className="outline_desc">生成大纲 ---&gt; 挑选模板 --&gt; 实时生成PPT</div>
            {genStatus == 0 && <div className="input_div">
                <select defaultValue={selectType} onChange={e => setSelectType(e.target.value)}>
                    <option value="subject">根据主题</option>
                    <option value="text">根据内容</option>
                    <option value="file">根据文件</option>
                </select>
                {selectType == 'subject' && <div>
                    <input defaultValue={subject} placeholder="请输入PPT主题" maxLength={20} onBlur={e => setSubject(e.target.value)} />
                </div>}
                {selectType == 'text' && <div>
                    <textarea defaultValue={text} placeholder="请输入内容" maxLength={6000} rows={5} cols={50} onBlur={e => setText(e.target.value)} />
                </div>}
                {selectType == 'file' && <div>
                    <input id="input_file" type="file" placeholder="请选择文件" accept=".doc, .docx, .xls, .xlsx, .pdf, .ppt, .pptx, .txt" />
                </div>}
                <button onClick={generateOutline}>生成大纲</button>
            </div>}
            {genStatus == 1 && <div className="outline" dangerouslySetInnerHTML={{__html: outlineHtml}}></div>}
            {genStatus == 2 && <div>
                <button onClick={() => nextStep({ outline, dataUrl }) }>下一步：选择模板</button>
                <div className="outline_edit"><OutlineEdit outlineTree={outlineTree} update={(_outline) => { outline = _outline }} /></div>
            </div>}
        </div>
      </>
    )
  }

  export default GenerateOutline
