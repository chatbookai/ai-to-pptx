import { defineStore } from 'pinia'
import tinycolor from 'tinycolor2'
import { omit } from 'lodash'
import type { Slide, SlideTheme, PPTElement, PPTAnimation } from '@/types/slides'
import { slides } from '@/api/slides'
import { theme } from '@/api/theme'
import { layouts } from '@/api/layout'
import { mobanLayouts } from '@/api/mobanLayout'
import axios from 'axios'
import authConfig from '../configs/auth'

interface RemoveElementPropData {
  id: string
  propName: string | string[]
}

interface UpdateElementData {
  id: string | string[]
  props: Partial<PPTElement>
  slideId?: string
}

interface FormatedAnimation {
  animations: PPTAnimation[]
  autoNext: boolean
}

export interface SlidesState {
  title: string
  theme: SlideTheme
  slides: Slide[]
  slideIndex: number
  viewportRatio: number
}

export const getPageId = () => {
  if(window && window.location && window.location.href) {
    const parsedUrl = new URL(window.location.href);
    const id = parsedUrl.searchParams.get('id');
    console.log(id);
    return id;
  }
  else {
    return null;
  }
}

export const useSlidesStore = defineStore('slides', {
  state: (): SlidesState => ({
    title: '未命名演示文稿', // 幻灯片标题
    theme: theme, // 主题样式
    slides: slides, // 幻灯片页面数据
    slideIndex: 0, // 当前页面索引
    viewportRatio: 0.5625, // 可视区域比例，默认16:9
  }),

  getters: {
    currentSlide(state) {
      return state.slides[state.slideIndex]
    },
  
    currentSlideAnimations(state) {
      const currentSlide = state.slides[state.slideIndex]
      if (!currentSlide?.animations) return []

      const els = currentSlide.elements
      const elIds = els.map(el => el.id)
      return currentSlide.animations.filter(animation => elIds.includes(animation.elId))
    },

    // 格式化的当前页动画
    // 将触发条件为“与上一动画同时”的项目向上合并到序列中的同一位置
    // 为触发条件为“上一动画之后”项目的上一项添加自动向下执行标记
    formatedAnimations(state) {
      const currentSlide = state.slides[state.slideIndex]
      if (!currentSlide?.animations) return []

      const els = currentSlide.elements
      const elIds = els.map(el => el.id)
      const animations = currentSlide.animations.filter(animation => elIds.includes(animation.elId))

      const formatedAnimations: FormatedAnimation[] = []
      for (const animation of animations) {
        if (animation.trigger === 'click' || !formatedAnimations.length) {
          formatedAnimations.push({ animations: [animation], autoNext: false })
        }
        else if (animation.trigger === 'meantime') {
          const last = formatedAnimations[formatedAnimations.length - 1]
          last.animations = last.animations.filter(item => item.elId !== animation.elId)
          last.animations.push(animation)
          formatedAnimations[formatedAnimations.length - 1] = last
        }
        else if (animation.trigger === 'auto') {
          const last = formatedAnimations[formatedAnimations.length - 1]
          last.autoNext = true
          formatedAnimations[formatedAnimations.length - 1] = last
          formatedAnimations.push({ animations: [animation], autoNext: false })
        }
      }
      return formatedAnimations
    },
  
    layouts(state) {
      const {
        themeColor,
        fontColor,
        fontName,
        backgroundColor,
      } = state.theme
  
      const subColor = tinycolor(fontColor).isDark() ? 'rgba(230, 230, 230, 0.5)' : 'rgba(180, 180, 180, 0.5)'
  
      const layoutsString = JSON.stringify(layouts)
        .replace(/{{themeColor}}/g, themeColor)
        .replace(/{{fontColor}}/g, fontColor)
        .replace(/{{fontName}}/g, fontName)
        .replace(/{{backgroundColor}}/g, backgroundColor)
        .replace(/{{subColor}}/g, subColor)
      
      return JSON.parse(layoutsString)
    },

    mobanLayouts(state) {
		  const {
		    themeColor,
		    fontColor,
		    fontName,
		    backgroundColor,
		  } = state.theme
		  
		  const subColor = tinycolor(fontColor).isDark() ? 'rgba(230, 230, 230, 0.5)' : 'rgba(180, 180, 180, 0.5)'
		  
		  const layoutsString = JSON.stringify(mobanLayouts)
		    .replace(/{{themeColor}}/g, themeColor)
		    .replace(/{{fontColor}}/g, fontColor)
		    .replace(/{{fontName}}/g, fontName)
		    .replace(/{{backgroundColor}}/g, backgroundColor)
		    .replace(/{{subColor}}/g, subColor)
		  
		  return JSON.parse(layoutsString)
		},

  },

  actions: {

    async setTitle(title: string) {
      if (!title) this.title = '未命名演示文稿'
      else this.title = title
      console.log("slides setTitle", title)
      const fileId = getPageId()
      if(fileId) {
        try {
          const RS = await axios.post(authConfig.backEndApiChatBook + '/api/pptx/setTitle', {fileId, title}, {
            headers: { Authorization: 'auth?.user?.token', 'Content-Type': 'application/json' },
          }).then(res => res.data);
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      }
    },

    async setTheme(themeProps: Partial<SlideTheme>) {
      this.theme = { ...this.theme, ...themeProps }
      console.log("slides setTheme", themeProps)
      const fileId = getPageId()
      if(fileId) {
        try {
          const RS = await axios.post(authConfig.backEndApiChatBook + '/api/pptx/setTheme', {fileId, themeProps}, {
            headers: { Authorization: 'auth?.user?.token', 'Content-Type': 'application/json' },
          }).then(res => res.data);
          console.log("setTheme", RS)
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      }
    },
  
    async setViewportRatio(viewportRatio: number) {
      this.viewportRatio = viewportRatio
      console.log("slides setViewportRatio", viewportRatio)
      const fileId = getPageId()
      if(fileId) {
        try {
          const RS = await axios.post(authConfig.backEndApiChatBook + '/api/pptx/setViewportRatio', {fileId, viewportRatio}, {
            headers: { Authorization: 'auth?.user?.token', 'Content-Type': 'application/json' },
          }).then(res => res.data);
          console.log("updateElement", RS)
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      }
    },
  
    async setSlides(slides: Slide[]) {
      this.slides = slides
      console.log("slides setSlides", slides)
      const fileId = getPageId()
      if(fileId) {
        try {
          const RS = await axios.post(authConfig.backEndApiChatBook + '/api/pptx/setSlides', {fileId, slides}, {
            headers: { Authorization: 'auth?.user?.token', 'Content-Type': 'application/json' },
          }).then(res => res.data);
          console.log("updateElement", RS)
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      }
    },
  
    async addSlide(slide: Slide | Slide[]) {
      const slides = Array.isArray(slide) ? slide : [slide]
      const addIndex = this.slideIndex + 1
      this.slides.splice(addIndex, 0, ...slides)
      this.slideIndex = addIndex
      console.log("slides addSlide", slide)
      const fileId = getPageId()
      if(fileId) {
        try {
          const RS = await axios.post(authConfig.backEndApiChatBook + '/api/pptx/addSlide', {fileId, addIndex, addSlide: slides }, {
            headers: { Authorization: 'auth?.user?.token', 'Content-Type': 'application/json' },
          }).then(res => res.data);
          console.log("slides addSlide", RS)
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      }
    },
  
    async updateSlide(props: Partial<Slide>) {
      const slideIndex = this.slideIndex
      this.slides[slideIndex] = { ...this.slides[slideIndex], ...props }
      console.log("slides updateSlide", props)
      const fileId = getPageId()
      if(fileId) {
        try {
          const RS = await axios.post(authConfig.backEndApiChatBook + '/api/pptx/updateSlide', {fileId, slideIndex, props}, {
            headers: { Authorization: 'auth?.user?.token', 'Content-Type': 'application/json' },
          }).then(res => res.data);
          console.log("slides updateElement", RS)
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      }
    },

    async updateSlidesStyleSequentially(props: Partial<Slide>) {
      // 获取当前的幻灯片数量
      const slidesCount = this.slides.length;
  
      // 循环更新每一张幻灯片
      for (let slideIndex = 0; slideIndex < slidesCount; slideIndex++) {
          // 更新当前幻灯片
          this.slides[slideIndex] = { ...this.slides[slideIndex], ...props };
          console.log("Updating slide", slideIndex, "with", props);
  
          const fileId = getPageId();
          if (fileId) {
              try {
                  await axios.post(authConfig.backEndApiChatBook + '/api/pptx/updateSlide', {
                      fileId,
                      slideIndex,
                      props
                  }, {
                      headers: { Authorization: 'auth?.user?.token', 'Content-Type': 'application/json' },
                  }).then(res => res.data);
                  console.log("Slide updated on server", slideIndex);
              } catch (error) {
                  console.error('Error updating slide:', slideIndex, error);
              }
          }
  
          // 等待一段时间再更新下一张幻灯片，以便用户可以看到更新的过程
          await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
      }
  },



  
    deleteSlide(slideId: string | string[]) {
      const slidesId = Array.isArray(slideId) ? slideId : [slideId]
  
      const deleteSlidesIndex = []
      for (let i = 0; i < slidesId.length; i++) {
        const index = this.slides.findIndex(item => item.id === slidesId[i])
        deleteSlidesIndex.push(index)
      }
      let newIndex = Math.min(...deleteSlidesIndex)
  
      const maxIndex = this.slides.length - slidesId.length - 1
      if (newIndex > maxIndex) newIndex = maxIndex
  
      this.slideIndex = newIndex
      this.slides = this.slides.filter(item => !slidesId.includes(item.id))
      console.log("slides deleteSlide", slideId)
    },
  
    updateSlideIndex(index: number) {
      this.slideIndex = index
    },
  
    async addElement(element: PPTElement | PPTElement[]) {
      const elements = Array.isArray(element) ? element : [element]
      const currentSlideEls = this.slides[this.slideIndex].elements
      const newEls = [...currentSlideEls, ...elements]
      this.slides[this.slideIndex].elements = newEls
      console.log("slides addElement", element)
      const fileId = getPageId()
      if(fileId) {
        try {
          const RS = await axios.post(authConfig.backEndApiChatBook + '/api/pptx/setSlide', {fileId, slideIndex: this.slideIndex, elements: newEls}, {
            headers: { Authorization: 'auth?.user?.token', 'Content-Type': 'application/json' },
          }).then(res => res.data);
          console.log("slides addElement", RS)
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      }
    },

    async deleteElement(elementId: string | string[]) {
      const elementIdList = Array.isArray(elementId) ? elementId : [elementId]
      const currentSlideEls = this.slides[this.slideIndex].elements
      const newEls = currentSlideEls.filter(item => !elementIdList.includes(item.id))
      this.slides[this.slideIndex].elements = newEls
      console.log("slides deleteElement", elementId)
      const fileId = getPageId()
      if(fileId) {
        try {
          const RS = await axios.post(authConfig.backEndApiChatBook + '/api/pptx/setSlide', {fileId, slideIndex: this.slideIndex, elements: newEls}, {
            headers: { Authorization: 'auth?.user?.token', 'Content-Type': 'application/json' },
          }).then(res => res.data);
          console.log("slides deleteElement", RS)
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      }
    },
  
    async updateElement(data: UpdateElementData) {
      const { id, props, slideId } = data
      const elIdList = typeof id === 'string' ? [id] : id

      const slideIndex = slideId ? this.slides.findIndex(item => item.id === slideId) : this.slideIndex
      const slide = this.slides[slideIndex]
      const elements = slide.elements.map(el => {
        return elIdList.includes(el.id) ? { ...el, ...props } : el
      })
      this.slides[slideIndex].elements = (elements as PPTElement[])
      console.log("slides updateElement", this.slides)
      const fileId = getPageId()
      if(fileId) {
        try {
          const RS = await axios.post(authConfig.backEndApiChatBook + '/api/pptx/setSlide', {fileId, slideIndex, elements: this.slides[slideIndex].elements}, {
            headers: { Authorization: 'auth?.user?.token', 'Content-Type': 'application/json' },
          }).then(res => res.data);
          console.log("slides updateElement", RS)
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      }
    },
  
    async removeElementProps(data: RemoveElementPropData) {
      const { id, propName } = data
      const propsNames = typeof propName === 'string' ? [propName] : propName
  
      const slideIndex = this.slideIndex
      const slide = this.slides[slideIndex]
      const elements = slide.elements.map(el => {
        return el.id === id ? omit(el, propsNames) : el
      })
      this.slides[slideIndex].elements = (elements as PPTElement[])
      console.log("slides removeElementProps", data)
      const fileId = getPageId()
      if(fileId) {
        try {
          const RS = await axios.post(authConfig.backEndApiChatBook + '/api/pptx/setSlide', {fileId, slideIndex: this.slideIndex, elements: this.slides[slideIndex].elements}, {
            headers: { Authorization: 'auth?.user?.token', 'Content-Type': 'application/json' },
          }).then(res => res.data);
          console.log("slides removeElementProps", RS)
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      }
    },
  },
})