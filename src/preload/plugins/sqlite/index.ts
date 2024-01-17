/*
 * @Author: nijineko
 * @Date: 2024-01-17 22:13:41
 * @LastEditTime: 2024-01-17 23:29:41
 * @LastEditors: nijineko
 * @Description: sqlite封装
 * @FilePath: \Epub-Reader\src\preload\plugins\sqlite\index.ts
 */
import sqlite3 from 'sqlite3'
import { Database, open } from 'sqlite'
import fs from 'fs'

/**
 * @description: 打开数据库，并保存链接到全局变量
 * @return {Promise<void>} Promise
 */
const openDatabase = (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
    return new Promise(async (resolve, reject) => {
        // 创建data目录
        if (!fs.existsSync('./data')) {
            fs.mkdirSync('./data')
        }

        try {
            let db = await open({
                filename: './data/database.db',
                driver: sqlite3.Database
            })

            createTable()

            resolve(db)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * @description: 创建表
 */
const createTable = () => {
    // 创建书籍表
    global.db?.exec(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            type TEXT NOT NULL,
            cover TEXT,
            author TEXT,
            description TEXT
        )
    `)
}

const database = {
    openDatabase,
}

export default database