import type { Slide } from '@/types/slides'

import axios from 'axios';

export async function fetchSlides() {
  try {
    const response = await axios.post('http://localhost:1988/api/pptx/getPPTXContent', {id: 101});
    return response.data;
  } catch (error) {
    console.error('Error fetching slides:', error);
    return [];
  }
}

export const slides = await fetchSlides();
