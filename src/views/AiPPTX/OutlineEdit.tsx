import { useState } from 'react'

function appendMd(children: any) {
  let str = ''
  for (let i = 0; i < children.length; i++) {
      const level = children[i].level
      if (level == 0) {
          str += '- '
      } else {
          for (let j = 0; j < level; j++) {
              str += '#'
          }
          str += ' '
      }
      str += children[i].name + '\n'
      if (children[i].children) {
          str += appendMd(children[i].children)
      }
  }

  return str
}

let version = 0

function OutlineEdit({outlineTree, update}: { outlineTree: any, update: (outline: string) => void}) {
  const [, setVersion] = useState(0)

  const updateOutline = () => {
      let outlineMd = ''
      outlineMd += '# ' + outlineTree.name + '\n'
      outlineMd += appendMd(outlineTree.children)
      update(outlineMd)
      setVersion(++version)
  }

  const operate = (children: any, idx: number, type: number) => {
      const current = children[idx]
      if (type == 1) {
          // 在上方新增同级
          children.splice(idx, 0, {
              level: current.level,
              name: '请输入文字',
              children: []
          })
      } else if (type == 2) {
          // 在下方新增下属
          current.children.splice(0, 0, {
              level: current.level + 1,
              name: '请输入文字',
              children: []
          })
      } else if (type == 3) {
          // 删除
          children.splice(idx, 1)
      }
      updateOutline()
  }

  return (
    <>
      <div className='outline_div'>
          <div className="subject_div">{ outlineTree && outlineTree.name }</div>
          {outlineTree && outlineTree.children.map((chapter: any, chapterIdx: number) => {
              return (
                  <div key={version + '_' + chapterIdx}>
                      <div className="chapter_div">
                          <div className="chapter_title">第{ chapterIdx + 1 }章</div>
                          <div className="chapter_name">
                              <input defaultValue={chapter.name} onBlur={e => {
                                  chapter.name = e.target.value
                                  updateOutline()
                              }} />
                          </div>
                          <div className="operate_div">
                              <span title="在上方新增同级" onClick={() => operate(outlineTree.children, chapterIdx, 1)}>=+</span>
                              <span title="在下方新增下属" onClick={() => operate(outlineTree.children, chapterIdx, 2)}>+</span>
                              <span title="删除" onClick={() => operate(outlineTree.children, chapterIdx, 3)}>x</span>
                          </div>
                      </div>
                      {chapter.children.map((page: any, pageIdx: number) => {
                          return (
                              <div key={chapterIdx + '-' + pageIdx}>
                                  <div className="page_div">
                                      <span className="page_number">{ chapterIdx + 1 }.{ pageIdx + 1 }</span>
                                      <div className="page_name">
                                          <input defaultValue={page.name} onBlur={e => {
                                              page.name = e.target.value;
                                              updateOutline()
                                          }} />
                                      </div>
                                      <div className="operate_div">
                                          <span title="在上方新增同级" onClick={() => operate(chapter.children, pageIdx, 1)}>=+</span>
                                          <span title="在下方新增下属" onClick={() => operate(chapter.children, pageIdx, 2)}>+</span>
                                          <span title="删除" onClick={() => operate(chapter.children, pageIdx, 3)}>x</span>
                                      </div>
                                  </div>
                                  {page.children.map((title: any, titleIdx: number) => {
                                      return (
                                          <div key={chapterIdx + '-' + pageIdx + '-' + titleIdx}>
                                              <div className="title_div">
                                                  <span className="title_number">{ chapterIdx + 1 }.{ pageIdx + 1 }.{ titleIdx + 1 }</span>
                                                  <div className="title_name">
                                                      <input defaultValue={title.name} onBlur={e => {
                                                          title.name = e.target.value;
                                                          updateOutline()
                                                      }} />
                                                  </div>
                                                  <div className="operate_div">
                                                      <span title="在上方新增同级" onClick={() => operate(page.children, titleIdx, 1)}>=+</span>
                                                      <span title="删除" onClick={() => operate(page.children, titleIdx, 3)}>x</span>
                                                  </div>
                                              </div>
                                          </div>
                                      )
                                  })}
                              </div>
                          )
                      })}
                  </div>
              )
          })}
      </div>
    </>
  )
}

export default OutlineEdit
