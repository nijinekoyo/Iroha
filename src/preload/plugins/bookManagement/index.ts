/*
 * @Author: nijineko
 * @Date: 2024-01-17 22:41:46
 * @LastEditTime: 2024-01-18 18:08:08
 * @LastEditors: nijineko
 * @Description: 书籍管理封装
 * @FilePath: \Epub-Reader\src\preload\plugins\bookManagement\index.ts
 */
import { books } from "../../typings/database";
import database from "../sqlite";

// 打开数据库
let db = await database.openDatabase()

// 读取全部书籍
const getBooks = async (): Promise<books[]> => {
    if (!db) {
        throw new Error('数据库初始化失败')
    }

    return await db.all<books[]>('SELECT * FROM books')
}

// 读取单个书籍
const getBook = async (id: number): Promise<books> => {
    if (!db) {
        throw new Error('数据库初始化失败')
    }

    try {
        const book = await db.get<books>('SELECT * FROM books WHERE id = ?', id)

        if (!book) {
            throw new Error('书籍不存在')
        }

        return book
    } catch (error) {
        throw error
    }
}

// 创建书籍
const createBook = async (book: books): Promise<number> => {
    if (!db) {
        throw new Error('数据库初始化失败')
    }

    try {
        const result = await db.run(`
            INSERT INTO books (name, file_path, file_sha256, type, cover, author, description)
            VALUES (?, ?, ?, ?, ?, ?)
        `, book.name, book.file_path, book.file_sha256, book.type, book.cover, book.author, book.description)

        if (!result.lastID) {
            throw new Error('创建书籍失败')
        }

        return result.lastID
    } catch (error) {
        throw error
    }
}

// 更新书籍
const updateBook = async (id: number, book: books): Promise<void> => {
    if (!db) {
        throw new Error('数据库初始化失败')
    }

    try {
        const result = await db.run(`
            UPDATE books
            SET name = ?, file_path = ?, file_sha256 = ?, type = ?, cover = ?, author = ?, description = ?
            WHERE id = ?
        `, book.name, book.file_path, book.file_sha256, book.type, book.cover, book.author, book.description, id)

        if (!result.changes) {
            throw new Error('更新书籍失败')
        }
    } catch (error) {
        throw error
    }
}

// 删除书籍
const deleteBook = async (id: number): Promise<void> => {
    if (!db) {
        throw new Error('数据库初始化失败')
    }

    try {
        const result = await db.run('DELETE FROM books WHERE id = ?', id)

        if (!result.changes) {
            throw new Error('删除书籍失败')
        }
    } catch (error) {
        throw error
    }
}

const bookManagement = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
}

export default bookManagement