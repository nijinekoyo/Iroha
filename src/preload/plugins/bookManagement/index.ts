/*
 * @Author: nijineko
 * @Date: 2024-01-17 22:41:46
 * @LastEditTime: 2024-01-18 23:58:30
 * @LastEditors: nijineko
 * @Description: 书籍管理封装
 * @FilePath: \Epub-Reader\src\preload\plugins\bookManagement\index.ts
 */
import { books } from "@/typings/database";
import database from "../sqlite";
import path from "path";
import fs from "fs";

// 封面保存路径
const coverPath = './data/images/covers/'
// 书籍保存路径
const bookPath = './data/books/'

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
        // 检查书籍SHA256是否已存在
        const checkBook = await db.get<books>('SELECT * FROM books WHERE file_sha256 = ?', book.file_sha256)
        if (checkBook) {
            throw new Error('书籍已存在')
        }

        const result = await db.run(`
            INSERT INTO books (name, file_path, file_sha256, type, cover, author, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
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

/**
 * @description: 保存书籍封面
 * @param {string} sha256 书籍sha256
 * @param {ArrayBuffer} cover 封面数据
 * @param {string} ext 封面文件后缀
 * @return {Promise<string>} 返回保存路径
 */
const saveCover = async (sha256: string, cover: ArrayBuffer, ext: string): Promise<string> => {
    let savePath = path.join(coverPath, sha256 + ext)

    try {
        // 创建封面保存目录
        fs.mkdirSync(coverPath, { recursive: true })

        // 保存封面
        fs.writeFileSync(savePath, Buffer.from(cover))

        return savePath
    } catch (error) {
        throw error
    }
}

/**
 * @description: 保存书籍
 * @param {string} sha256 书籍sha256
 * @param {ArrayBuffer} book 书籍数据
 * @param {string} ext 书籍文件后缀
 * @return {Promise<string>} 返回保存路径
 */
const saveBook = async (sha256: string, book: ArrayBuffer, ext: string): Promise<string> => {
    let savePath = path.join(bookPath, sha256 + ext)

    try {
        // 创建书籍保存目录
        fs.mkdirSync(bookPath, { recursive: true })

        // 保存书籍
        fs.writeFileSync(savePath, Buffer.from(book))

        return savePath
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
    saveCover,
    saveBook
}

export default bookManagement