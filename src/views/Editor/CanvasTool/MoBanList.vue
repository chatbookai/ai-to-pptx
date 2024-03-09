<template>
  <div class="layout-pool">
    <div 
      class="layout-item"
      v-for="(slide,index) in templateCoverList" 
      :key="slide.id"
      @click="selectSlideTemplate(index)"
    >
      <ThumbnailSlide class="thumbnail" :slide="slide" :size="180" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { Slide } from '@/types/slides'
import { moban01 } from '@/api/moban01'
import { moban02 } from '@/api/moban02'
import { moban03 } from '@/api/moban03'
import { slides } from '@/api/slides'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

const emit = defineEmits<{
  (event: 'select', payload: Slide[]): void
}>()

const { templateCoverList } = storeToRefs(useSlidesStore())

const selectSlideTemplate = (index: number) => {
  switch (index) {
    case 0:
      emit('select', [].concat(moban01))
      break
    case 1:
      emit('select', [].concat(moban02))
      break
    case 2:
      emit('select', [].concat(moban03))
      break
    default:
      emit('select', [].concat(slides))
      break
  }
}
</script>

<style lang="scss" scoped>
.layout-pool {
  width: 100%;
  height: 500px;
  padding: 2px;
  margin-right: -12px;
  padding-right: 12px;
  overflow: auto;

  @include flex-grid-layout();
}
.layout-item {
  @include flex-grid-layout-children(4, 25%);

	margin-bottom: 20px;
  // &:nth-last-child(2), &:last-child {
  //   margin-bottom: 0;
  // }

  .thumbnail {
    outline: 2px solid $borderColor;
    transition: outline $transitionDelay;
    cursor: pointer;

    &:hover {
      outline-color: $themeColor;
    }
  }
}
</style>