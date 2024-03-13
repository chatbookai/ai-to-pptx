<template>
  <div class="element-chat-panel">
    <div class="element-chat" v-if="handleElement">
    </div>
    <div class="tip"  @click="selectSlideTemplate(0)" v-else><IconClick style="margin-right: 5px;"/> 点我选择模板</div>
    <Divider />

  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { nanoid } from 'nanoid'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { fetchMoban } from '@/api/moban' 

import Divider from '@/components/Divider.vue'
import Button from '@/components/Button.vue'


import { getTemplate } from "@/api/template";
import type { Slide } from '@/types/slides'

const { templateCoverList } = storeToRefs(useSlidesStore())

const selectSlideTemplate = async (index: number) => {
  const template = await getTemplate(index + 1)
  console.log("Template selected", template)
  chooseSlideByTemplate([].concat(template))
}
const slidesStore = useSlidesStore()
const chooseSlideByTemplate = (slides: Slide[]) => {
  slidesStore.setSlides(slides)
}

</script>

<style lang="scss" scoped>
$inColor: #68a490;
$outColor: #d86344;
$attentionColor: #e8b76a;

.element-chat-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.element-chat {
  height: 32px;
  display: flex;
  align-items: center;
}
.element-chat-btn {
  width: 100%;
}
.tip {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: italic;
}

</style>