import { useState, useEffect, useCallback } from 'react'
import '../styles/SelectTemplate.css'

let background = null as any

export default function SelectTemplate({token, nextStep}: { token: string, nextStep: (id: string) => void}) {
    const [templateId, setTemplateId] = useState('')
    const [templates, setTemplates] = useState([] as any)

    const loadTemplates = useCallback(async () => {
        const url = 'https://docmee.cn/api/ppt/randomTemplates'
        const resp = await (await fetch(url, {
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ page: 1, size: 28, filters: { type: 1 } })
        })).json()
        if (resp.code != 0) {
            alert('获取模板异常：' + resp.message)

            return
        }
        setTemplates(resp.data || [])
        selectTemplate(resp.data[0])
    }, [token])

    const selectTemplate = useCallback((template: any) => {
        setTemplateId(template.id)
        const src = template.coverUrl + '?token=' + token
        calcSubjectColor(src).then((color) => {
            if (background == null) {
                background = document.body.style.background
            }
            document.body.style.background = color
        })
    }, [token])

    useEffect(() => {
        loadTemplates()
    }, [])

    return (
      <>
        <div className="template_content">
            <div>---- 选择模板 ----</div>
            <div className="but_div">
                <button onClick={() => {
                    nextStep(templateId)
                    document.body.style.background = background
                }}>下一步: 生成PPT</button>
            </div>
            <div className="template_div">
                {templates.map((template: any) => (
                    <div className={template.id == templateId ? 'template template_select' : 'template'} key={template.id} onClick={() => selectTemplate(template)}>
                        <img src={template.coverUrl + '?token=' + token} />
                    </div>
                ))}
                <div className="template_but">
                    <button onClick={loadTemplates}>换一批</button>
                </div>
                { templates.length == 0 && <div>模板加载中...</div> }
            </div>
        </div>
      </>
    )
}

async function calcSubjectColor(src: string) {
    const img = new Image()
    await new Promise(resolve => {
        const eqOrigin = src.startsWith('data:') || src.startsWith(document.location.origin) || (src.startsWith('//') && (document.location.protocol + src).startsWith(document.location.origin))
        if (!eqOrigin) {
            img.crossOrigin = 'anonymous'
        }
        img.src = src
        img.onload = function() {
            resolve(img)
        }
        img.onerror = function () {
            resolve(null)
        }
    })
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as any
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const map = {} as any
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const rgb = r + g + b
        if (rgb <= 50 || rgb >= 660) {
            // 忽略黑白
            continue
        }
        const color = `${r},${g},${b}`
        map[color] = (map[color] || 0) + 1
    }
    const valueMap = {} as any
    for (const k in map) {
        const v = map[k]
        const ks = valueMap[v]
        if (ks) {
            ks.push(k)
        } else {
            valueMap[v] = [k]
        }
    }
    const colors = [] as any
    const values = Object.values(map).sort() as any
    for (let i = values.length - 1; i >= 0; i--) {
        const ks = valueMap[values[i]]
        for (let j = 0; j < ks.length; j++) {
            colors.push(ks[j])
            if (colors.length >= 3) {
                break
            }
        }
        if (colors.length >= 3) {
            break
        }
    }

    // return `rgb(${colors[0]})`
    return `linear-gradient(to bottom right, rgb(${colors[0]}), rgb(${colors[1]}), rgb(${colors[2]}))`
}
