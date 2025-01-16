import { useEffect, useRef } from 'react'
import OutlineEdit from './OutlineEdit'
import { marked } from 'marked'
import { SSE } from 'src/functions/AiPPTX/sse'
import { BackendApi } from './Config'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

import { PlayCircleFilled } from "@mui/icons-material";
import { ArrowBack } from '@mui/icons-material';

let outline = ''
let outlineTree = null as any

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    async: false,
    breaks: false,
    pedantic: false,
    silent: true
})

const StepTwoThreeGenerateOutline = ({activeStep, setActiveStep, inputData, setInputData, token}: any) => {

    // 生成状态: 0未开始 1生成中 2已完成

    const parseTextFromAiResult = (ParseText: string) => {
        const ParseTextArray = ParseText.split("\n")
        console.log("ParseTextArray", ParseTextArray)
        const ParseResult: any = {}
        let TitleOne = ''
        let TitleTwo = ''
        let TitleThree = ''
        let Subject = ''
        ParseTextArray.map((Item: string)=>{
            if(Item.trim() !="" && Item.trim() !="```markdown" && Item.trim() !="```")  {
                if(Item.trim().startsWith('# '))  {
                    Subject = Item.trim().substring(2)
                }
                else if(Item.trim().startsWith('## '))  {
                    TitleOne = Item.trim().substring(6)
                    ParseResult[TitleOne] = {}
                }
                else if(Item.trim().startsWith('### '))  {
                    TitleTwo = Item.trim().substring(7)
                    ParseResult[TitleOne][TitleTwo] = []
                }
                else if(Item.trim().startsWith('#### '))  {
                    //标题
                    TitleThree = Item.trim().substring(11)
                    if(TitleOne!="" && TitleTwo!="" && TitleThree!="")   {
                        ParseResult[TitleOne][TitleTwo].push(TitleThree)
                    }
                }
                else    {
                    //标题
                    TitleThree = Item.trim().substring(6)
                    if(TitleOne!="" && TitleTwo!="" && TitleThree!="")   {
                        ParseResult[TitleOne][TitleTwo].push(TitleThree)
                    }
                }
            }
        })

        const ResultTopChildren: any = []
        const KeysOne = Object.keys(ParseResult)
        KeysOne.map((ItemOne: string)=>{
            const MapOne = ParseResult[ItemOne]
            const KeysTwo = Object.keys(MapOne)
            const ResultOneChildren: any = []
            KeysTwo.map((ItemTwo: string)=>{
                const MapTwo = MapOne[ItemTwo]
                const ResultTwoChildren: any = []
                MapTwo.map((ItemThree: string)=>{
                    ResultTwoChildren.push({name: ItemThree, level: 4, children: []})
                })
                const ResultTwo = {name: ItemTwo, level: 3, children: ResultTwoChildren}
                console.log("MapTwo", ItemTwo, MapTwo)
                ResultOneChildren.push(ResultTwo)
            })
            const ResultOne = {name: ItemOne, level: 2, children: ResultOneChildren}
            ResultTopChildren.push(ResultOne)
        })
        const ResultMap = {name: Subject, level: 1, children: ResultTopChildren}
        console.log("ResultMap", ResultMap)

        return ResultMap
    }

    const generateOutline = () => {

        //outline = TestText
        //setActiveStep(2)
        //outlineTree = parseTextFromAiResult(TestText)
        //return

        setActiveStep(1)
        setInputData((prevState: any) => ({...prevState, outlineHtml: '<h3>正在生成中，请稍后....</h3>'}))
        const submitData = {subject: inputData.inputText}
        const url = BackendApi + 'generateOutline.php'
        const source = new SSE(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'token': token
            },
            payload: JSON.stringify(submitData),
        }) as any
        source.onmessage = function (data: any) {
            if(data.data != "[DONE]")       {
                try {
                    const json = JSON.parse(data.data)
                    if(json && json.choices && json.choices[0] && json.choices[0]['delta'] && json.choices[0]['delta']['content']) {

                      //console.log("json.choices[0]['delta']['content']", json.choices[0]['delta']['content'])
                      outline = outline + json.choices[0]['delta']['content']
                      const outlineHtml = marked.parse(outline.replace('```markdown', '').replace(/```/g, '')) as string
                      if(outline && outline.length > 20) {
                        setInputData((prevState: any) => ({...prevState, outlineContent: outline, outlineHtml: outlineHtml}))
                      }
                    }
                }
                catch(ErrorMsg: any) {
                    console.log("ErrorMsg", ErrorMsg)
                }
            }
            else {
                console.log("[DONE]outline", outline)
                outlineTree = parseTextFromAiResult(outline)
                console.log("[DONE]outlineTree", outlineTree)
                const outlineHtml = marked.parse(outline.replace('```markdown', '').replace(/```/g, '')) as string
                setInputData((prevState: any) => ({...prevState, outlineContent: outline, outlineHtml: outlineHtml}))
            }
        }
        source.onend = function (data: any) {
            if (data.data.startsWith('{') && data.data.endsWith('}')) {
                const json = JSON.parse(data.data)
                if (json.code != 0) {
                    alert('生成大纲异常：' + json.message)
                    setActiveStep(0)

                    return
                }
            }
            setActiveStep(2)
        }
        source.onerror = function (err: any) {
            console.error('生成大纲异常', err)
            alert('生成大纲异常')
            setActiveStep(0)
        }
        source.stream()
    }

    const outlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (inputData) {
          window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight })
      }
      if (outlineRef.current) {
        // 将滚动条滚动到底部
        outlineRef.current.scrollTop = outlineRef.current.scrollHeight;
      }
    }, [inputData])

    useEffect(() => {
      activeStep == 1 && generateOutline()
      activeStep == 2 && window.scrollTo(0, 0)
    }, [activeStep])

    //console.log("activeStep0001", activeStep, inputData, outline, outlineTree)

    return (
      <>
        {activeStep == 1 && (
          <Grid
            ref={outlineRef} // 绑定 ref
            dangerouslySetInnerHTML={{ __html: inputData.outlineHtml }}
            style={{
              overflowY: 'auto',
              maxHeight: '100%',
              width: '100%',
              wordWrap: 'break-word',
              whiteSpace: 'normal',
            }}
          />
        )}
        {activeStep == 2 && (
          <Grid>
            <Grid container justifyContent="center">
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(0)}
                  startIcon={<ArrowBack />}
                  sx={{mx: 1}}
                >
                  上一步
                </Button>
                <Button
                  variant={"contained"}
                  onClick={() => setActiveStep((prevActiveStep: number) => prevActiveStep + 1) }
                  startIcon={<PlayCircleFilled />}
                  >
                  下一步：选择模板
                </Button>
              </Grid>
            </Grid>
            <Grid className="outline_edit">
              <OutlineEdit outlineTree={outlineTree} update={(_outline) => { outline = _outline }} />
            </Grid>
          </Grid>
        )}
      </>
    )
}

export default StepTwoThreeGenerateOutline
