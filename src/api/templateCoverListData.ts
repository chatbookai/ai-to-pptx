/* eslint-disable max-lines */

import type { Slide } from '@/types/slides'

import axios from 'axios';

export async function fetchData() {
  try {
    const response = await axios.get('http://localhost:1988/api/pptx/getTemplateCovers');
    return response.data;
  } catch (error) {
    console.error('Error fetching slides:', error);
    return [];
  }
}

export const templateCoverListData: Slide[] = await fetchData();
