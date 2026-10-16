import { useMemo } from 'react';
import { DocumentStats } from '../types';

export function useWordCount(markdown: string): DocumentStats {
  return useMemo(() => {
    if (!markdown) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        lines: 0,
        readingTimeMinutes: 0,
      };
    }

    const cleanText = markdown
      .replace(/```[\s\S]*?```/g, '')
      .replace(/#+\s+/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[*_~`]/g, '')
      .trim();

    const wordsArray = cleanText.length > 0 ? cleanText.split(/\s+/) : [];
    const words = wordsArray.length;
    const characters = markdown.length;
    const charactersNoSpaces = markdown.replace(/\s/g, '').length;
    const lines = markdown.split('\n').length;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

    return {
      words,
      characters,
      charactersNoSpaces,
      lines,
      readingTimeMinutes,
    };
  }, [markdown]);
}