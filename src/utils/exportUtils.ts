import { DocumentItem } from '../types';

export function downloadMarkdownFile(doc: DocumentItem) {
  const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAllBackupJSON(documents: DocumentItem[]) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(documents, null, 2));
  const link = document.createElement('a');
  link.href = dataStr;
  link.setAttribute('download', `draftmark_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function triggerPDFExport() {
  window.print();
}