import { ElectronAPI } from '@electron-toolkit/preload'
import sqlite3 from 'sqlite3'
import { Database } from 'sqlite'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    fs: any
    bookManagement: {
      getBooks: () => Promise<books[]>
      getBook: (id: number) => Promise<books>
      createBook: (book: books) => Promise<number>
      updateBook: (book: books) => Promise<void>
      deleteBook: (id: number) => Promise<void>
    }
  }
}
