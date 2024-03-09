/* eslint-disable max-lines */

import type { Slide } from '@/types/slides'

import axios from 'axios';

export async function getTemplate(id: number) {
  try {
    const response = await axios.post('http://localhost:1988/api/pptx/getTemplate', {id});
    return response.data;
  } catch (error) {
    console.error('Error fetching slides:', error);
    return [];
  }
}

