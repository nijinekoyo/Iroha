/*
 * @Author: nijineko
 * @Date: 2024-01-17 22:43:24
 * @LastEditTime: 2024-01-18 18:05:58
 * @LastEditors: nijineko
 * @Description: 数据库类型定义
 * @FilePath: \Epub-Reader\src\preload\typings\database.ts
 */
export type books = {
    id?: number,
    name: string,
    file_path: string,
    file_sha256: string,
    type: 'epub',
    cover?: string,
    author?: string,
    description?: string,
}