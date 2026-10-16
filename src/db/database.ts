import Dexie, { Table } from 'dexie';
import { DocumentItem } from '../types';

class DraftmarkDatabase extends Dexie {
  documents!: Table<DocumentItem, string>;

  constructor() {
    super('DraftmarkDB');
    this.version(1).stores({
      documents: 'id, title, createdAt, updatedAt'
    });
  }
}

export const db = new DraftmarkDatabase();

export async function createNewDocument(title = 'Untitled Document', content = ''): Promise<DocumentItem> {
  const newDoc: DocumentItem = {
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    title,
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await db.documents.add(newDoc);
  return newDoc;
}

export async function getAllDocuments(): Promise<DocumentItem[]> {
  return await db.documents.orderBy('updatedAt').reverse().toArray();
}

export async function saveDocumentContent(id: string, content: string, title?: string): Promise<void> {
  const updateData: Partial<DocumentItem> = {
    content,
    updatedAt: Date.now(),
  };
  if (title !== undefined) {
    updateData.title = title;
  }
  await db.documents.update(id, updateData);
}

export async function deleteDocument(id: string): Promise<void> {
  await db.documents.delete(id);
}