import { useEffect, useRef, useState } from 'react';
import { saveDocumentContent } from '../db/database';

export type SaveStatus = 'saved' | 'saving' | 'error';

export function useAutosave(
  docId: string | null,
  content: string,
  title: string,
  delay = 600
) {
  const [status, setStatus] = useState<SaveStatus>('saved');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!docId) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setStatus('saving');

    const timer = setTimeout(async () => {
      try {
        await saveDocumentContent(docId, content, title);
        setStatus('saved');
      } catch (error) {
        console.error('Autosave failed:', error);
        setStatus('error');
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [docId, content, title, delay]);

  return { status, setStatus };
}